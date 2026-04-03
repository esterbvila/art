import "server-only";

import { DrizzleConfig, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { JwtPayload, jwtDecode } from "jwt-decode";
import postgres from "postgres";
import { createClient } from "../supabase/server";

const config = {
  casing: "snake_case",
  schema,
} satisfies DrizzleConfig<typeof schema>;

declare namespace global {
  let postgresSqlClient: ReturnType<typeof postgres> | undefined;
  let adminPostgresSqlClient: ReturnType<typeof postgres> | undefined;
}

let postgresSqlClient;
let adminPostgresSqlClient;

const databaseUrl = process.env.DATABASE_URL;
const directDatabaseUrl = process.env.DIRECT_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Environment variable DATABASE_URL is not set.");
}
if (!directDatabaseUrl) {
  throw new Error("Environment variable DIRECT_DATABASE_URL is not set.");
}

if (process.env.NODE_ENV !== "production") {
  if (!global.postgresSqlClient) {
    global.postgresSqlClient = postgres(databaseUrl, { prepare: false });
  }
  if (!global.adminPostgresSqlClient) {
    global.adminPostgresSqlClient = postgres(directDatabaseUrl, { prepare: false });
  }
  postgresSqlClient = global.postgresSqlClient;
  adminPostgresSqlClient = global.adminPostgresSqlClient;
} else {
  postgresSqlClient = postgres(databaseUrl, { prepare: false });
  adminPostgresSqlClient = postgres(directDatabaseUrl, { prepare: false });
}

export const db = drizzle({
  client: postgresSqlClient,
  ...config,
  logger: false,
});

export const adminDb = drizzle({
  client: adminPostgresSqlClient,
  ...config,
  logger: false,
});

export async function getDrizzleSupabaseClient() {
  const client = await createClient();
  const { data } = await client.auth.getSession();
  const accessToken = data.session?.access_token ?? "";
  const token = decode(accessToken);

  const runTransaction = ((transaction, config) => {
    return db.transaction(async tx => {
      try {
        await tx.execute(sql`
            select set_config('request.jwt.claims', '${sql.raw(JSON.stringify(token))}', TRUE);
            select set_config('request.jwt.claim.sub', '${sql.raw(token.sub ?? "")}', TRUE);
            set local role ${sql.raw(token.role ?? "anon")};
        `);

        const result = await transaction(tx);

        await tx.execute(sql`
            select set_config('request.jwt.claims', NULL, TRUE);
            select set_config('request.jwt.claim.sub', NULL, TRUE);
            reset role;
        `);

        return result;
      } catch (error) {
        console.error("Transaction failed:", {
          error,
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
          userId: token.sub,
          role: token.role,
        });
        throw error;
      }
    }, config);
  }) as typeof db.transaction;

  return {
    runTransaction,
  };
}

function decode(accessToken: string) {
  try {
    return jwtDecode<JwtPayload & { role: string }>(accessToken);
  } catch {
    return { role: "anon" } as JwtPayload & { role: string };
  }
}
