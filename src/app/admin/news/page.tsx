"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import RichTextEditor from "@/components/RichTextEditor";

interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl: string;
  published: boolean;
}

const API_URL = "http://localhost:5000/api/news";

const ADMIN_API_URL = "http://localhost:5000/api/news/admin/all";

const BACKEND_URL = "http://localhost:5000";

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);

  const [title, setTitle] = useState("");

  const [summary, setSummary] = useState("");

  const [content, setContent] = useState("");

  const [image, setImage] = useState<File | null>(null);

  const [published, setPublished] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadNews() {
    try {
      const response = await fetch(ADMIN_API_URL, {
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load news.");
      }

      const data: NewsItem[] = await response.json();

      setNews(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not load news.");
    } finally {
      setPageLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    fetch(ADMIN_API_URL, {
      cache: "no-store",
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Could not load news.");
        }

        return response.json() as Promise<NewsItem[]>;
      })
      .then((data) => {
        if (active) {
          setNews(data);
        }
      })
      .catch((error: unknown) => {
        if (!active) return;

        setError(
          error instanceof Error ? error.message : "Could not load news.",
        );
      })
      .finally(() => {
        if (active) {
          setPageLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  function resetForm() {
    setTitle("");
    setSummary("");
    setContent("");
    setImage(null);
    setPublished(true);
    setEditingId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("News title is required.");

      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());

    formData.append("summary", summary.trim());

    formData.append("content", content);

    formData.append("published", String(published));

    if (image) {
      formData.append("image", image);
    }

    setLoading(true);

    try {
      const wasEditing = Boolean(editingId);

      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PATCH" : "POST",

          credentials: "include",

          body: formData,
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Could not save news.");
      }

      resetForm();

      await loadNews();

      setSuccess(
        wasEditing ? "News updated successfully." : "News added successfully.",
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save news.");
    } finally {
      setLoading(false);
    }
  }

  function startEditing(item: NewsItem) {
    setError("");
    setSuccess("");

    setEditingId(item._id);

    setTitle(item.title);

    setSummary(item.summary);

    setContent(item.content);

    setImage(null);

    setPublished(item.published);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteNews(id: string) {
    if (!window.confirm("Delete this news article?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",

        credentials: "include",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Could not delete news.");
      }

      if (editingId === id) {
        resetForm();
      }

      await loadNews();

      setSuccess("News deleted successfully.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not delete news.",
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-green-700">
            Mahila SACCOS
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">Manage News</h1>

          <p className="mt-2 text-sm text-gray-500">
            Create and publish formatted news articles.
          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="my-8 rounded-2xl border bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-900">
              {editingId ? "Edit News" : "Add News"}
            </h2>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="mt-6 space-y-6">
            {/* TITLE */}

            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
                placeholder="News title"
              />
            </div>

            {/* SUMMARY */}

            <div>
              <label className="mb-2 block text-sm font-medium">Summary</label>

              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
                placeholder="Short summary shown on the news listing"
              />
            </div>

            {/* RICH CONTENT */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Content
              </label>

              <RichTextEditor value={content} onChange={setContent} />

              <p className="mt-2 text-xs text-gray-400">
                Use headings, bold text, lists and quotes to format the article.
              </p>
            </div>

            {/* IMAGE */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Featured Image
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />

              {editingId && (
                <p className="mt-2 text-xs text-gray-500">
                  Leave empty to keep the existing image.
                </p>
              )}
            </div>

            {/* PUBLISHED */}

            <label className="flex w-fit cursor-pointer items-center gap-3 rounded-xl border bg-gray-50 px-4 py-3">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 accent-green-700"
              />

              <div>
                <p className="text-sm font-medium">Published</p>

                <p className="text-xs text-gray-500">
                  Show this article on the public website.
                </p>
              </div>
            </label>

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

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-50"
              >
                {loading ? "Saving..." : editingId ? "Update News" : "Add News"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        {/* NEWS LIST */}

        {pageLoading ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500">
            Loading news...
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500">
            No news articles found.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <article
                key={item._id}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm"
              >
                {item.imageUrl && (
                  <img
                    src={`${BACKEND_URL}${item.imageUrl}`}
                    alt={item.title}
                    className="h-44 w-full object-cover"
                  />
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-bold text-gray-900">{item.title}</h2>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${
                        item.published
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.published ? "Published" : "Hidden"}
                    </span>
                  </div>

                  {item.summary && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                      {item.summary}
                    </p>
                  )}

                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(item)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteNews(item._id)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
