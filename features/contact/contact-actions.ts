"use server";
import { notifyContactSubmission } from "@/features/email/email";
import { createAdminClient } from "@/lib/supabase";

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

  const adminSupabase = createAdminClient();

  const windowStart = new Date(Date.now() - WINDOW_MS).toISOString();
  const { count } = await adminSupabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })
    .eq("email", email.trim().toLowerCase())
    .gte("created_at", windowStart);

  if (count !== null && count >= LIMIT) {
    return { error: "Too many messages. Please try again later." };
  }

  const { error } = await adminSupabase.from("contact_submissions").insert({
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
  });

  if (error) {
    console.error("Failed to save contact submission:", error.message);
    return { error: "Failed to send message. Please try again." };
  }

  await notifyContactSubmission({ firstName, lastName, email, message });

  return { error: undefined };
}
