"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  Mail,
  MessageSquare,
  Send,
  Tag,
  User,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default function ContactPage() {
  const [sent, setSent] =
    useState(false);

  const [error, setError] =
    useState("");

  const [sending, setSending] =
    useState(false);

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSent(false);
    setError("");
    setSending(true);

    const form =
      e.currentTarget;

    const formData =
      new FormData(form);

    const data = {
      name:
        formData.get("name"),
      email:
        formData.get("email"),
      subject:
        formData.get("subject"),
      message:
        formData.get("message"),
    };

    try {
      const response =
        await fetch(
          `${API_URL}/api/messages`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(data),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to send message"
        );
      }

      form.reset();
      setSent(true);
    } catch {
      setError(
        "Unable to send your message. Please try again."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">

        {/* HEADER */}

        <div className="mb-8 text-center">
          <span className="inline-flex rounded-full bg-green-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-green-700">
            Contact Us
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Drop Your Message
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Have a question,
            suggestion or message?
            Send it directly to
            Mahila SACCOS.
          </p>
        </div>

        {/* FORM */}

        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-5"
          >

            <Field
              label="Name"
              icon={User}
            >
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                required
                className="w-full bg-transparent py-3 text-sm text-gray-800 outline-none"
              />
            </Field>

            <Field
              label="E-mail"
              icon={Mail}
            >
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className="w-full bg-transparent py-3 text-sm text-gray-800 outline-none"
              />
            </Field>

            <Field
              label="Subject"
              icon={Tag}
            >
              <input
                type="text"
                name="subject"
                placeholder="What is your message about?"
                required
                className="w-full bg-transparent py-3 text-sm text-gray-800 outline-none"
              />
            </Field>

            {/* MESSAGE */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Message
              </label>

              <div className="flex items-start rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-green-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-100">
                <MessageSquare
                  size={18}
                  className="mr-3 mt-4 shrink-0 text-green-600"
                />

                <textarea
                  name="message"
                  placeholder="Write your message..."
                  required
                  rows={5}
                  className="w-full resize-none bg-transparent py-3.5 text-sm leading-6 text-gray-800 outline-none"
                />
              </div>
            </div>

            {/* FEEDBACK */}

            {sent && (
              <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                ✓ Message submitted
                successfully.
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* BUTTON */}

            <button
              type="submit"
              disabled={
                sending
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending
                ? "Sending..."
                : "Send Message"}

              {!sending && (
                <Send
                  size={17}
                />
              )}
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

      <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-green-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-100">
        <Icon
          size={18}
          className="mr-3 shrink-0 text-green-600"
        />

        {children}
      </div>
    </div>
  );
}