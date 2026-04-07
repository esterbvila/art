"use server";

import { and, count, eq, gte } from "drizzle-orm";
import { db } from "@/drizzle/client";
import { contactSubmissionSchema } from "@/drizzle/schema";
import { notifyContactSubmission } from "@/features/email/email";

const LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000;

type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

export async function submitContactAction(payload: ContactPayload): Promise<{ error?: string }> {
  const { firstName, lastName, email, message } = payload;

  const normalizedEmail = email.trim().toLowerCase();
  const windowStart = new Date(Date.now() - WINDOW_MS).toISOString();

  try {
    const [{ count: recentSubmissionCount }] = await db
      .select({ count: count() })
      .from(contactSubmissionSchema)
      .where(
        and(eq(contactSubmissionSchema.email, normalizedEmail), gte(contactSubmissionSchema.createdAt, windowStart)),
      );

    if (recentSubmissionCount >= LIMIT) {
      return { error: "Too many messages. Please try again later." };
    }
  } catch (error) {
    console.error("Failed to check contact submission rate limit:", error);
    return { error: "Failed to send message. Please try again." };
  }

  try {
    await db.insert(contactSubmissionSchema).values({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      message: message.trim(),
    });
  } catch (error) {
    console.error("Failed to save contact submission:", error);
    return { error: "Failed to send message. Please try again." };
  }

  await notifyContactSubmission({ firstName, lastName, email, message });

  return { error: undefined };
}
