"use client";

import { FormEvent, useEffect, useState } from "react";

interface Achievement {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  published: boolean;
}

const API_URL = "http://localhost:5000/api/achievements";

const BACKEND_URL = "http://localhost:5000";

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [order, setOrder] = useState(1);

  const [published, setPublished] = useState(true);

  const [image, setImage] = useState<File | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  async function loadAchievements() {
    try {
      const response = await fetch(API_URL, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load achievements.");
      }

      const data: Achievement[] = await response.json();

      setAchievements(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not load achievements.",
      );
    } finally {
      setPageLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch(API_URL, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load achievements.");
        return response.json() as Promise<Achievement[]>;
      })
      .then((data) => {
        if (!controller.signal.aborted) setAchievements(data);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            error instanceof Error
              ? error.message
              : "Could not load achievements.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setPageLoading(false);
      });
    return () => controller.abort();
  }, []);

  function clearImageInput() {
    const input = document.getElementById(
      "achievement-image",
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setOrder(1);
    setPublished(true);
    setImage(null);
    setEditingId(null);

    clearImageInput();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Title / शीर्षक is required.");
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());

    formData.append("description", description.trim());

    formData.append("order", String(order));

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
        throw new Error(data?.message || "Failed to save achievement.");
      }

      resetForm();

      await loadAchievements();

      setSuccess(
        wasEditing
          ? "Achievement updated successfully."
          : "Achievement added successfully.",
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  function editAchievement(achievement: Achievement) {
    setError("");
    setSuccess("");

    setEditingId(achievement._id);

    setTitle(achievement.title);

    setDescription(achievement.description);

    setOrder(achievement.order);

    setPublished(achievement.published);

    setImage(null);

    clearImageInput();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteAchievement(id: string) {
    if (!window.confirm("Delete this achievement?")) {
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
        throw new Error(data?.message || "Failed to delete achievement.");
      }

      if (editingId === id) {
        resetForm();
      }

      await loadAchievements();

      setSuccess("Achievement deleted successfully.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Delete failed.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Manage Achievements
        </h1>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Add awards, certificates and institutional achievements.
        </p>

        <form
          onSubmit={handleSubmit}
          className="my-8 rounded-2xl bg-white p-4 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-semibold">
            {editingId ? "Edit Achievement" : "Add Achievement"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Content may be entered in English or Nepali.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Title / शीर्षक
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Achievement title / उपलब्धिको शीर्षक"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:→
border-[#1F3C88]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description / विवरण
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Description / विवरण"
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:→
border-[#1F3C88]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Display Order
              </label>

              <input
                type="number"
                min="1"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Image / Certificate
              </label>

              <input
                id="achievement-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>
          </div>

          {editingId && (
            <p className="mt-2 text-xs text-gray-500">
              Leave image empty to keep the current image.
            </p>
          )}

          <label className="mt-5 flex w-fit items-center gap-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />

            <span className="text-sm text-gray-700">Published</span>
          </label>

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-[#1F3C88]">
              {success}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#1F3C88] px-6 py-3 font-medium text-white disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Achievement"
                  : "Add Achievement"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg bg-gray-200 px-6 py-3"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Achievements
        </h2>

        {pageLoading ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500">
            Loading...
          </div>
        ) : (
          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement._id}
                className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center"
              >
                <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-36">
                  {achievement.imageUrl ? (
                    <img
                      src={`${BACKEND_URL}${achievement.imageUrl}`}
                      alt={achievement.title}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {achievement.title}
                  </h3>

                  {achievement.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {achievement.description}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-gray-100 px-3 py-1">
                      Order: {achievement.order}
                    </span>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-[#1F3C88]">
                      {achievement.published ? "Published" : "Hidden"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => editAchievement(achievement)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteAchievement(achievement._id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {achievements.length === 0 && (
              <div className="rounded-xl bg-white p-10 text-center text-gray-500">
                No achievements added yet.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
