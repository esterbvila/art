import { useState } from 'react';
import { Instagram } from 'lucide-react';

/**
 * Contact section — two-column layout matching the prototype.
 * Left: contact info (title, description, email, Instagram).
 * Right: minimal line-style form (First Name, Last Name, Email, Message, Submit).
 *
 * Form state is managed locally; submission posts to /api/contact.
 */
export default function ContactForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    message:   '',
    website:   '', // honeypot — must stay empty
  });
  const [errors,  setErrors]  = useState({});
  const [status,  setStatus]  = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [apiError, setApiError] = useState('');

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!form.email.trim())     e.email     = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.message.trim())   e.message   = 'Required';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setErrors({});
    setStatus('loading');
    setApiError('');

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error ?? 'Something went wrong.');
        setStatus('error');
      } else {
        setStatus('success');
        setForm({ firstName: '', lastName: '', email: '', message: '', website: '' });
      }
    } catch {
      setApiError('Could not send message. Please try again.');
      setStatus('error');
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => { const n = { ...er }; delete n[name]; return n; });
  }

  return (
    <div className="flex flex-col md:flex-row gap-10 md:gap-[120px] px-5 md:px-[48px] py-12 md:py-[80px]">

      {/* ── Contact Info (left column) ───────────────────────────────── */}
      <div className="flex flex-col gap-7 md:gap-[28px] w-full md:flex-1">
        {/* Label */}
        <p className="font-sans font-normal text-text-tertiary text-[13px] tracking-[3px] uppercase">
          Get in Touch
        </p>

        {/* Title */}
        <h2
          className="font-sans font-normal text-text-primary leading-tight95"
          style={{ fontSize: 'clamp(36px, 3.6vw, 52px)', letterSpacing: '-1.5px' }}
        >
          Commission{'\n'}a Painting
        </h2>

        {/* Description */}
        <p className="font-sans font-normal text-text-secondary text-[15px] leading-[1.7]">
          Interested in a custom piece or have questions about availability?
          Every commission begins with a conversation about your space, your
          tastes, and the feeling you want to bring home.
        </p>

        {/* Divider */}
        <div className="w-10 h-px bg-divider" />

        {/* Instagram row */}
        <a
          href="https://instagram.com/esterii_creates"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 hover:opacity-70 transition-opacity"
        >
          <Instagram size={16} className="text-text-tertiary flex-shrink-0" />
          <span className="font-sans font-normal text-text-secondary text-[14px]">
            @esterii_creates
          </span>
        </a>
      </div>

      {/* ── Contact Form (right column) ──────────────────────────────── */}
      <div className="w-full md:flex-1">
        {status === 'success' ? (
          /* Success state */
          <div className="flex flex-col gap-4 py-8">
            <p className="font-sans font-normal text-text-tertiary text-[13px] tracking-[3px] uppercase">
              Message sent
            </p>
            <p className="font-sans font-normal text-text-primary text-[15px] leading-[1.7]">
              Thank you for reaching out. I will get back to you within a few
              days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7 md:gap-[28px]">
            {/* Honeypot — hidden from humans, bots fill it in */}
            <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Name row */}
            <div className="flex gap-6 w-full">
              <FieldLine
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                error={errors.firstName}
              />
              <FieldLine
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                error={errors.lastName}
              />
            </div>

            {/* Email */}
            <FieldLine
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />

            {/* Message */}
            <div className="flex flex-col gap-3 w-full">
              <label htmlFor="message" className="font-sans font-normal text-text-tertiary text-[12px] tracking-[1px] uppercase">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                className="input-line"
                placeholder=""
              />
              {errors.message && (
                <p className="font-sans text-[12px] text-red-400">{errors.message}</p>
              )}
            </div>

            {/* API error */}
            {apiError && (
              <p className="font-sans text-[13px] text-red-500">{apiError}</p>
            )}

            {/* Submit button */}
            <div className="flex">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-accent text-white font-sans font-normal text-[14px] tracking-[0.5px] px-10 py-3.5 hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
              >
                {status === 'loading' ? 'Sending…' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ── Minimal line-style form field ─────────────────────────────────────────── */
function FieldLine({ label, name, type = 'text', value, onChange, error }) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <label
        htmlFor={name}
        className="font-sans font-normal text-text-tertiary text-[12px] tracking-[1px] uppercase"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="input-line"
        autoComplete={name === 'email' ? 'email' : 'off'}
      />
      {error && (
        <p className="font-sans text-[12px] text-red-400">{error}</p>
      )}
    </div>
  );
}
