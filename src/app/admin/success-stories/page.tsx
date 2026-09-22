"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

interface SuccessStory {
  _id: string;
  name: string;
  title: string;
  story: string;
  imageUrl: string;
  published: boolean;
}

const API_URL =
  "http://localhost:5000/api/success-stories";

const BACKEND_URL =
  "http://localhost:5000";

export default function AdminSuccessStoriesPage() {
  const [stories, setStories] = useState<
    SuccessStory[]
  >([]);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [image, setImage] =
    useState<File | null>(null);

  const [published, setPublished] =
    useState(true);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  async function loadStories() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          "Failed to load success stories"
        );
      }

      setStories(await response.json());
    } catch (error) {
      console.error(error);
      alert(
        "Could not load success stories."
      );
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch(API_URL, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load success stories.");
        return response.json() as Promise<SuccessStory[]>;
      })
      .then((data) => { if (!controller.signal.aborted) setStories(data); })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          alert(error instanceof Error ? error.message : "Could not load success stories.");
        }
      });
    return () => controller.abort();
  }, []);

  function resetForm() {
    setName("");
    setTitle("");
    setStory("");
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

    if (!name.trim()) {
      alert("Member name is required.");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("title", title);
    formData.append("story", story);
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

      if (!response.ok) {
        throw new Error(
          "Request failed"
        );
      }

      resetForm();
      await loadStories();
    } catch (error) {
      console.error(error);
      alert(
        "Could not save success story."
      );
    } finally {
      setLoading(false);
    }
  }

  function startEditing(
    item: SuccessStory
  ) {
    setEditingId(item._id);
    setName(item.name);
    setTitle(item.title);
    setStory(item.story);
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

  async function deleteStory(
    id: string
  ) {
    if (
      !window.confirm(
        "Delete this success story?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Delete failed"
        );
      }

      if (editingId === id) {
        resetForm();
      }

      await loadStories();
    } catch (error) {
      console.error(error);
      alert(
        "Could not delete success story."
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Manage Success Stories
        </h1>

        <p className="mt-2 text-gray-500">
          Add and manage member success stories.
        </p>

        <form
          onSubmit={handleSubmit}
          className="my-8 rounded-lg bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block font-medium">
                Member Name
              </label>

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Member name"
                className="w-full rounded-md border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Title
              </label>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Optional title"
                className="w-full rounded-md border border-gray-300 px-4 py-3"
              />
            </div>

          </div>

          <div className="mt-5">
            <label className="mb-2 block font-medium">
              Success Story
            </label>

            <textarea
              value={story}
              onChange={(e) =>
                setStory(e.target.value)
              }
              rows={8}
              placeholder="Member success story"
              className="w-full rounded-md border border-gray-300 px-4 py-3"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block font-medium">
              Member Image
            </label>

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
              className="w-full rounded-md border border-gray-300 px-4 py-3"
            />

            {editingId && (
              <p className="mt-2 text-xs text-gray-500">
                Leave empty to keep the
                existing image.
              </p>
            )}
          </div>

          <label className="mt-5 flex items-center gap-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) =>
                setPublished(
                  e.target.checked
                )
              }
            />

            Published
          </label>

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              disabled={loading}
              className="rounded-md bg-green-700 px-6 py-3 text-white disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Story"
                  : "Add Story"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md bg-gray-200 px-6 py-3"
              >
                Cancel
              </button>
            )}

          </div>
        </form>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {stories.map((item) => (
            <article
              key={item._id}
              className="overflow-hidden rounded-lg bg-white shadow-sm"
            >
              {item.imageUrl && (
                <img
                  src={`${BACKEND_URL}${item.imageUrl}`}
                  alt={item.name}
                  className="h-56 w-full object-cover"
                />
              )}

              <div className="p-5">

                <h2 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h2>

                {item.title && (
                  <p className="mt-1 text-sm font-medium text-green-700">
                    {item.title}
                  </p>
                )}

                <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-600">
                  {item.story}
                </p>

                <p className="mt-3 text-xs">
                  {item.published
                    ? "Published"
                    : "Hidden"}
                </p>

                <div className="mt-5 flex gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      startEditing(item)
                    }
                    className="rounded bg-blue-600 px-4 py-2 text-sm text-white"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteStory(item._id)
                    }
                    className="rounded bg-red-600 px-4 py-2 text-sm text-white"
                  >
                    Delete
                  </button>

                </div>
              </div>
            </article>
          ))}

        </div>
      </div>
    </main>
  );
}