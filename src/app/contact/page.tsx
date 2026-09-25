"use client";

import { FormEvent, useState } from "react";

import { Mail, MessageSquare, Send, Tag, User } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSent(false);
    setError("");
    setSending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      form.reset();
      setSent(true);
    } catch {
      setError("Unable to send your message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="border-b border-blue-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-10 bg-[#1F3C88]" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1F3C88]">
              Contact Us
            </p>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            Get in Touch
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            Have a question, suggestion, or message for Byas Saving & Credit
            Co-Operative Ltd.? Send it below and our team will get back to you.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Name" icon={User}>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                required
                className="w-full bg-transparent py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
            </Field>

            <Field label="E-mail" icon={Mail}>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className="w-full bg-transparent py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
            </Field>

            <Field label="Subject" icon={Tag}>
              <input
                type="text"
                name="subject"
                placeholder="What is your message about?"
                required
                className="w-full bg-transparent py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
            </Field>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Message
              </label>

              <div className="flex items-start rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-[#1F3C88] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                <MessageSquare
                  size={18}
                  className="mr-3 mt-4 shrink-0 text-[#1F3C88]"
                />

                <textarea
                  name="message"
                  placeholder="Write your message..."
                  required
                  rows={5}
                  className="w-full resize-none bg-transparent py-3.5 text-sm leading-6 text-gray-800 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {sent && (
              <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                ✓ Message submitted successfully.
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F3C88] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#162E6A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send Message"}
              {!sending && <Send size={17} />}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-[#1F3C88] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
        <Icon size={18} className="mr-3 shrink-0 text-[#1F3C88]" />
        {children}
      </div>
    </div>
  );
}
