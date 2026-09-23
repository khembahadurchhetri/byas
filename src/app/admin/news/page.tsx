"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import ConfirmModal from "@/components/ConfirmModal";
import RichTextEditor from "@/components/RichTextEditor";

interface NewsItem {
  _id: string;
  title: string;
  titleHtml?: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
  published: boolean;
  createdAt: string;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const API_URL = `${BACKEND_URL}/api/news`;
const ADMIN_API_URL = `${API_URL}/admin/all`;

function htmlToText(html: string) {
  if (typeof window === "undefined") {
    return html.replace(/<[^>]+>/g, "").trim();
  }

  const div = document.createElement("div");
  div.innerHTML = html;

  return (div.textContent || "").trim();
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [titleHtml, setTitleHtml] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [published, setPublished] = useState(true);
  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  async function loadNews() {
    try {
      const response = await fetch(ADMIN_API_URL, {
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Could not load news.");
      }

      setNews(await response.json());
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not load news."
      );
    } finally {
      setPageLoading(false);
    }
  }

  useEffect(() => {
    loadNews();
  }, []);

  function resetForm() {
    setTitleHtml("");
    setSummary("");
    setContent("");
    setImage(null);
    setPublished(true);
    setEditingId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const plainTitle =
      htmlToText(titleHtml);

    if (!plainTitle) {
      setError("Article title is required.");
      return;
    }

    const formData = new FormData();

    formData.append("title", plainTitle);
    formData.append(
      "titleHtml",
      titleHtml
    );

    formData.append(
      "summary",
      summary.trim()
    );

    formData.append(
      "content",
      content
    );

    formData.append(
      "published",
      String(published)
    );

    if (image) {
      formData.append("image", image);
    }

    setLoading(true);

    try {
      const response = await fetch(
        editingId
          ? `${API_URL}/${editingId}`
          : API_URL,
        {
          method: editingId
            ? "PATCH"
            : "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Could not save article."
        );
      }

      const editing =
        Boolean(editingId);

      resetForm();
      await loadNews();

      setSuccess(
        editing
          ? "Article updated successfully."
          : "Article created successfully."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not save article."
      );
    } finally {
      setLoading(false);
    }
  }

  function startEditing(
    item: NewsItem
  ) {
    setError("");
    setSuccess("");

    setEditingId(item._id);

    setTitleHtml(
      item.titleHtml ||
        `<p>${item.title}</p>`
    );

    setSummary(item.summary || "");
    setContent(item.content || "");
    setPublished(item.published);
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteNews() {
    if (!deleteId) return;

    setDeleting(true);

    try {
      const response = await fetch(
        `${API_URL}/${deleteId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Could not delete article."
        );
      }

      if (editingId === deleteId) {
        resetForm();
      }

      setDeleteId(null);
      await loadNews();

      setSuccess(
        "Article deleted successfully."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not delete article."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f8f7] px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
              Mahila SACCOS CMS
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-950">
              News Management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Create formatted news,
              announcements and updates.
            </p>
          </div>

          <div className="rounded-xl border bg-white px-4 py-2 text-sm text-gray-500">
            {news.length} articles
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-4">
            <div>
              <h2 className="font-bold text-gray-900">
                {editingId
                  ? "Edit Article"
                  : "Create Article"}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Images are optional.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border bg-white px-4 py-2 text-sm"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_300px]">
            <div className="space-y-6">
              <div>
                <div className="mb-2">
                  <label className="text-sm font-bold text-gray-700">
                    Article Title
                  </label>

                  <p className="mt-1 text-xs text-gray-400">
                    You can style the
                    title with headings,
                    color, alignment,
                    bold and underline.
                  </p>
                </div>

                <RichTextEditor
                  variant="title"
                  value={titleHtml}
                  onChange={
                    setTitleHtml
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Subtitle / Summary
                </label>

                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) =>
                    setSummary(
                      e.target.value
                    )
                  }
                  placeholder="A short introduction shown on news cards and below the title."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Full Content
                </label>

                <RichTextEditor
                  value={content}
                  onChange={
                    setContent
                  }
                />
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border bg-gray-50 p-4">
                <h3 className="text-sm font-bold text-gray-800">
                  Featured Image
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-400">
                  Optional. Text-only
                  news is fully supported.
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(e) =>
                    setImage(
                      e.target.files?.[0] ||
                        null
                    )
                  }
                  className="mt-4 w-full text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-green-700 file:px-3 file:py-2 file:text-white"
                />

                {editingId && (
                  <p className="mt-2 text-xs text-gray-400">
                    Leave empty to keep
                    the current image.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">
                      Published
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Show publicly.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setPublished(
                        !published
                      )
                    }
                    className={`relative h-7 w-12 rounded-full ${
                      published
                        ? "bg-green-700"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                        published
                          ? "left-6"
                          : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-green-700 px-5 py-3 font-bold text-white hover:bg-green-800 disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Update Article"
                    : published
                      ? "Publish Article"
                      : "Save Draft"}
              </button>
            </aside>
          </div>

          {(error || success) && (
            <div className="border-t px-6 py-4">
              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}
            </div>
          )}
        </form>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900">
            Articles
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage all published and
            hidden news.
          </p>

          {pageLoading ? (
            <div className="mt-4 rounded-2xl border bg-white p-10 text-center text-gray-400">
              Loading articles...
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-2xl border bg-white">
              {news.map(
                (item, index) => (
                  <article
                    key={item._id}
                    className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center ${
                      index !==
                      news.length - 1
                        ? "border-b"
                        : ""
                    }`}
                  >
                    {item.imageUrl && (
                      <img
                        src={`${BACKEND_URL}${item.imageUrl}`}
                        alt={item.title}
                        className="h-20 w-full rounded-xl object-cover sm:w-28"
                      />
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            item.published
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {item.published
                            ? "Published"
                            : "Hidden"}
                        </span>

                        {item.createdAt && (
                          <span className="text-xs text-gray-400">
                            {new Date(
                              item.createdAt
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 truncate font-bold text-gray-900">
                        {item.title}
                      </h3>

                      {item.summary && (
                        <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                          {item.summary}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          startEditing(
                            item
                          )
                        }
                        className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-blue-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteId(
                            item._id
                          )
                        }
                        className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>

        <ConfirmModal
          open={Boolean(deleteId)}
          title="Delete this news article?"
          description="This article will be permanently removed."
          loading={deleting}
          onCancel={() =>
            setDeleteId(null)
          }
          onConfirm={deleteNews}
        />
      </div>
    </main>
  );
}