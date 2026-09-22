"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  Mail,
  MailOpen,
  RefreshCw,
  Trash2,
} from "lucide-react";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const API_URL =
  "http://localhost:5000/api/messages";

export default function AdminMessagesPage() {
  const [
    messages,
    setMessages,
  ] = useState<Message[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  async function loadMessages() {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          API_URL,
          {
            credentials:
              "include",
            cache:
              "no-store",
          }
        );

      if (!response.ok) {
        if (
          response.status ===
          401
        ) {
          throw new Error(
            "Your admin session has expired. Please log in again."
          );
        }

        throw new Error(
          "Failed to load messages."
        );
      }

      const data: Message[] =
        await response.json();

      setMessages(data);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Could not load messages."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller =
      new AbortController();

    async function fetchMessages() {
      try {
        const response =
          await fetch(
            API_URL,
            {
              credentials:
                "include",
              cache:
                "no-store",
              signal:
                controller.signal,
            }
          );

        if (!response.ok) {
          if (
            response.status ===
            401
          ) {
            throw new Error(
              "Your admin session has expired. Please log in again."
            );
          }

          throw new Error(
            "Could not load messages."
          );
        }

        const data: Message[] =
          await response.json();

        if (
          !controller.signal
            .aborted
        ) {
          setMessages(data);
        }
      } catch (error) {
        if (
          controller.signal
            .aborted
        ) {
          return;
        }

        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Could not load messages."
        );
      } finally {
        if (
          !controller.signal
            .aborted
        ) {
          setLoading(false);
        }
      }
    }

    fetchMessages();

    return () => {
      controller.abort();
    };
  }, []);

  async function toggleRead(
    id: string
  ) {
    try {
      setError("");

      const response =
        await fetch(
          `${API_URL}/${id}/read`,
          {
            method:
              "PATCH",
            credentials:
              "include",
          }
        );

      if (!response.ok) {
        if (
          response.status ===
          401
        ) {
          throw new Error(
            "Your admin session has expired."
          );
        }

        throw new Error(
          "Could not update message."
        );
      }

      await loadMessages();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Could not update message."
      );
    }
  }

  async function removeMessage(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Delete this message?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response =
        await fetch(
          `${API_URL}/${id}`,
          {
            method:
              "DELETE",
            credentials:
              "include",
          }
        );

      if (!response.ok) {
        if (
          response.status ===
          401
        ) {
          throw new Error(
            "Your admin session has expired."
          );
        }

        throw new Error(
          "Could not delete message."
        );
      }

      await loadMessages();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Could not delete message."
      );
    }
  }

  const unreadCount =
    messages.filter(
      (item) =>
        !item.read
    ).length;

  return (
    <main className="min-h-screen bg-gray-100 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-green-700">
              Mahila SACCOS
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-800 sm:text-3xl">
              Contact Messages
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {unreadCount} unread
              message
              {unreadCount === 1
                ? ""
                : "s"}
            </p>
          </div>

          <button
            type="button"
            onClick={
              loadMessages
            }
            disabled={
              loading
            }
            className="flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* CONTENT */}

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
            Loading messages...
          </div>
        ) : messages.length ===
          0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <Mail
              size={38}
              className="mx-auto mb-4 text-gray-300"
            />

            <p className="text-gray-500">
              No contact messages
              yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(
              (item) => (
                <article
                  key={
                    item._id
                  }
                  className={`rounded-xl border bg-white p-5 shadow-sm sm:p-6 ${
                    item.read
                      ? "border-gray-100"
                      : "border-yellow-300"
                  }`}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    {/* MESSAGE */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="break-words font-semibold text-gray-800">
                          {
                            item.name
                          }
                        </h2>

                        {!item.read && (
                          <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                            New
                          </span>
                        )}
                      </div>

                      <a
                        href={`mailto:${item.email}`}
                        className="mt-1 block break-all text-sm text-green-700 hover:underline"
                      >
                        {
                          item.email
                        }
                      </a>

                      <h3 className="mt-4 break-words font-semibold text-gray-700">
                        {
                          item.subject
                        }
                      </h3>

                      <p className="mt-2 whitespace-pre-line break-words text-sm leading-7 text-gray-600">
                        {
                          item.message
                        }
                      </p>

                      <p className="mt-4 text-xs text-gray-400">
                        {new Date(
                          item.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          toggleRead(
                            item._id
                          )
                        }
                        className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
                      >
                        {item.read ? (
                          <>
                            <Mail
                              size={
                                16
                              }
                            />
                            Mark
                            Unread
                          </>
                        ) : (
                          <>
                            <MailOpen
                              size={
                                16
                              }
                            />
                            <Check
                              size={
                                14
                              }
                            />
                            Mark Read
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          removeMessage(
                            item._id
                          )
                        }
                        className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2
                          size={16}
                        />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}