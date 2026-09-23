"use client";

import { FormEvent, useEffect, useState } from "react";

interface GalleryItem {
  _id: string;
  title: string;
  imageUrl: string;
  published: boolean;
}

const API_URL = "http://localhost:5000/api/gallery";
const BACKEND_URL = "http://localhost:5000";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [published, setPublished] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadGallery() {
    const response = await fetch(API_URL);

    if (!response.ok) {
      alert("Could not load gallery.");
      return;
    }

    setImages(await response.json());
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch(API_URL, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load gallery.");
        return response.json() as Promise<GalleryItem[]>;
      })
      .then((data) => {
        if (!controller.signal.aborted) setImages(data);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          alert(
            error instanceof Error ? error.message : "Could not load gallery.",
          );
        }
      });
    return () => controller.abort();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingId && !image) {
      alert("Please choose an image.");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("published", String(published));

    if (image) {
      formData.append("image", image);
    }

    setLoading(true);

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PATCH" : "POST",
          credentials: "include",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      resetForm();
      await loadGallery();
    } catch (error) {
      console.error(error);
      alert("Could not save image.");
    } finally {
      setLoading(false);
    }
  }

  function startEditing(item: GalleryItem) {
    setEditingId(item._id);
    setTitle(item.title);
    setImage(null);
    setPublished(item.published);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setImage(null);
    setPublished(true);
  }

  async function deleteImage(id: string) {
    if (!window.confirm("Delete this image?")) {
      return;
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      alert("Could not delete image.");
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    await loadGallery();
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Gallery</h1>

        <p className="mt-2 text-gray-500">
          Add, edit and delete gallery images.
        </p>

        <form
          onSubmit={handleSubmit}
          className="my-8 rounded-lg bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Optional image title"
                className="w-full rounded-md border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Image</label>

              <input
                key={image ? image.name : "empty"}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full rounded-md border border-gray-300 px-4 py-3"
              />

              {editingId && (
                <p className="mt-2 text-xs text-gray-500">
                  Leave empty to keep current image.
                </p>
              )}
            </div>
          </div>

          <label className="mt-5 flex items-center gap-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Published
          </label>

          <div className="mt-6 flex gap-3">
            <button
              disabled={loading}
              className="rounded-md bg-[#1F3C88] px-6 py-3 text-white disabled:opacity-50"
            >
              {loading ? "Saving..." : editingId ? "Update Image" : "Add Image"}
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
          {images.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-lg bg-white shadow-sm"
            >
              <img
                src={`${BACKEND_URL}${item.imageUrl}`}
                alt={item.title || "Gallery image"}
                className="h-56 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="font-semibold text-gray-800">
                  {item.title || "Untitled"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {item.published ? "Published" : "Hidden"}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(item)}
                    className="rounded bg-blue-600 px-4 py-2 text-sm text-white"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteImage(item._id)}
                    className="rounded bg-red-600 px-4 py-2 text-sm text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
