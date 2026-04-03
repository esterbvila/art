"use client";
import { Instagram } from "lucide-react";
import { useActionState } from "react";
import { submitContactAction } from "./contact-actions";

type FormErrors = Partial<Record<"firstName" | "lastName" | "email" | "message", string>>;

type State =
  | { status: "success" }
  | { status: "invalid"; errors: FormErrors }
  | { status: "error"; error: string }
  | null;

const INITIAL_STATE: State = null;

function validate(data: FormData): FormErrors {
  const e: FormErrors = {};
  const email = String(data.get("email") ?? "").trim();

  if (!String(data.get("firstName") ?? "").trim()) {
    e.firstName = "Required";
  }

  if (!String(data.get("lastName") ?? "").trim()) {
    e.lastName = "Required";
  }

  if (!email) {
    e.email = "Required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    e.email = "Invalid email";
  }

  if (!String(data.get("message") ?? "").trim()) {
    e.message = "Required";
  }

  return e;
}

async function submitContact(_prev: State, data: FormData): Promise<State> {
  if (data.get("website")) {
    return { status: "success" };
  }

  const errors = validate(data);
  if (Object.keys(errors).length) {
    return { status: "invalid", errors };
  }

  try {
    const result = await submitContactAction({
      firstName: String(data.get("firstName")),
      lastName: String(data.get("lastName")),
      email: String(data.get("email")),
      message: String(data.get("message")),
    });

    if (result.error) {
      return { status: "error", error: result.error };
    }

    return { status: "success" };
  } catch {
    return { status: "error", error: "Could not send message. Please try again." };
  }
}

export default function ContactForm() {
  const [state, dispatch, isPending] = useActionState(submitContact, INITIAL_STATE);

  return (
    <div className="flex flex-col gap-10 px-5 py-12 md:flex-row md:gap-[120px] md:px-[48px] md:py-[80px]">
      <div className="flex w-full flex-col gap-7 md:flex-1 md:gap-[28px]">
        <p className="font-normal font-sans text-[13px] text-text-tertiary uppercase tracking-[3px]">Get in Touch</p>

        <h2
          className="font-normal font-sans text-text-primary leading-tight95"
          style={{ fontSize: "clamp(36px, 3.6vw, 52px)", letterSpacing: "-1.5px" }}
        >
          Commission a Painting
        </h2>

        <p className="font-normal font-sans text-[15px] text-text-secondary leading-[1.7]">
          Interested in a custom piece or have questions about availability? Every commission begins with a conversation
          about your space, your tastes, and the feeling you want to bring home.
        </p>

        <div className="h-px w-10 bg-divider" />

        <a
          href="https://instagram.com/esterii_creates"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-70"
        >
          <Instagram size={16} className="shrink-0 text-text-tertiary" />
          <span className="font-normal font-sans text-[14px] text-text-secondary">@esterii_creates</span>
        </a>
      </div>

      <div className="w-full md:flex-1">
        {state?.status === "success" ? (
          <div className="flex flex-col gap-4 py-8">
            <p className="font-normal font-sans text-[13px] text-text-tertiary uppercase tracking-[3px]">
              Message sent
            </p>
            <p className="font-normal font-sans text-[15px] text-text-primary leading-[1.7]">
              Thank you for reaching out. I will get back to you within a few days.
            </p>
          </div>
        ) : (
          <form action={dispatch} noValidate className="flex flex-col gap-7 md:gap-[28px]">
            {/* Honeypot */}
            <div style={{ position: "absolute", left: "-9999px", opacity: 0 }} aria-hidden="true">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            {/* Name row */}
            <div className="flex w-full gap-6">
              <FieldLine
                label="First Name"
                name="firstName"
                error={state?.status === "invalid" ? state.errors.firstName : undefined}
              />
              <FieldLine
                label="Last Name"
                name="lastName"
                error={state?.status === "invalid" ? state.errors.lastName : undefined}
              />
            </div>

            {/* Email */}
            <FieldLine
              label="Email Address"
              name="email"
              type="email"
              error={state?.status === "invalid" ? state.errors.email : undefined}
            />

            {/* Message */}
            <div className="flex w-full flex-col gap-3">
              <label
                htmlFor="message"
                className="font-normal font-sans text-[12px] text-text-tertiary uppercase tracking-[1px]"
              >
                Your Message
              </label>
              <textarea id="message" name="message" rows={4} className="input-line" placeholder="" />
              {state?.status === "invalid" && state.errors.message && (
                <p className="font-sans text-[12px] text-red-400">{state.errors.message}</p>
              )}
            </div>

            {/* API error */}
            {state?.status === "error" && <p className="font-sans text-[13px] text-red-500">{state.error}</p>}

            {/* Submit button */}
            <div className="flex">
              <button
                type="submit"
                disabled={isPending}
                className="cursor-pointer bg-accent px-10 py-3.5 font-normal font-sans text-[14px] text-white tracking-[0.5px] transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {isPending ? "Sending\u2026" : "Send Message"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

type FieldLineProps = {
  label: string;
  name: string;
  type?: string;
  error?: string;
};

function FieldLine({ label, name, type = "text", error }: FieldLineProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      <label htmlFor={name} className="font-normal font-sans text-[12px] text-text-tertiary uppercase tracking-[1px]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="input-line"
        autoComplete={name === "email" ? "email" : "off"}
      />
      {error && <p className="font-sans text-[12px] text-red-400">{error}</p>}
    </div>
  );
}
