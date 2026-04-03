import { NextRequest } from "next/server";
import { updateSession } from "./supabase/middleware";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}
