"use client";

import { FormEvent, useState } from "react";
import { Mail, MessageSquare, Send, Tag, User } from "lucide-react";

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
      const response = await fetch("http://localhost:5000/api/messages", {
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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-700">
            Contact Us
          </span>

          <h1 className="mt-4 text-3xl font-bold text-gray-800 sm:text-4xl">
            Drop Your Message
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
            Have a question or message for us? Fill in the form below.
          </p>
        </div>

        {/* Form Card */}
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-gray-200/60">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10">
            <div className="grid gap-5 md:grid-cols-3">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Name
                </label>

                <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-4 transition focus-within:border-yellow-400 focus-within:bg-white">
                  <User size={18} className="mr-3 shrink-0 text-yellow-500" />

                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                    className="w-full bg-transparent py-3.5 text-sm text-gray-700 outline-none"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Subject
                </label>

                <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-4 transition focus-within:border-yellow-400 focus-within:bg-white">
                  <Tag size={18} className="mr-3 shrink-0 text-yellow-500" />

                  <input
                    type="text"
                    name="subject"
                    placeholder="Message subject"
                    required
                    className="w-full bg-transparent py-3.5 text-sm text-gray-700 outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  E-mail
                </label>

                <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-4 transition focus-within:border-yellow-400 focus-within:bg-white">
                  <Mail size={18} className="mr-3 shrink-0 text-yellow-500" />

                  <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    required
                    className="w-full bg-transparent py-3.5 text-sm text-gray-700 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Message
              </label>

              <div className="flex items-start rounded-lg border border-gray-200 bg-gray-50 px-4 transition focus-within:border-yellow-400 focus-within:bg-white">
                <MessageSquare
                  size={19}
                  className="mr-3 mt-4 shrink-0 text-yellow-500"
                />

                <textarea
                  name="message"
                  placeholder="Write your message here..."
                  required
                  rows={7}
                  className="w-full resize-none bg-transparent py-4 text-sm leading-7 text-gray-700 outline-none"
                />
              </div>
            </div>

            {sent && (
              <div className="mt-5 rounded-lg bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">
                Message submitted successfully.
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* Button */}
            <div className="mt-7 flex justify-center">
              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-2 rounded-lg bg-yellow-400 px-8 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-yellow-500 hover:shadow-md"
              >
                {sending ? "Sending..." : "Send Message"}

                {!sending && <Send size={17} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
