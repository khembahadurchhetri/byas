"use client";

import { FormEvent, useEffect, useState } from "react";

interface Download {
  _id: string;
  title: string;
  fileUrl: string;
  published: boolean;
  createdAt: string;
}

const API_URL = "http://localhost:5000/api/downloads";
const BACKEND_URL = "http://localhost:5000";

export default function AdminDownloadsPage() {
  const [downloads, setDownloads] = useState<Download[]>([]);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [published, setPublished] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadDownloads() {
    try {
      setPageLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load downloads.");
      }

      const data = await response.json();

      setDownloads(data);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Could not load downloads."
      );
    } finally {
      setPageLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch(API_URL, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load downloads.");
        return response.json() as Promise<Download[]>;
      })
      .then((data) => { if (!controller.signal.aborted) setDownloads(data); })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setError(error instanceof Error ? error.message : "Could not load downloads.");
        }
      })
      .finally(() => { if (!controller.signal.aborted) setPageLoading(false); });
    return () => controller.abort();
  }, []);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setFile(null);
    setPublished(true);

    // Clears the actual file input too
    const fileInput = document.getElementById(
      "download-file"
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = "";
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    // Clear messages from previous attempt
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Download title is required.");
      return;
    }

    // New download must have a file
    if (!editingId && !file) {
      setError("Please select a file.");
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("published", String(published));

    if (file) {
      formData.append("file", file);
    }

    setLoading(true);

    try {
      const response = await fetch(
        editingId
          ? `${API_URL}/${editingId}`
          : API_URL,
        {
          method: editingId ? "PATCH" : "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        const data = await response
          .json()
          .catch(() => null);

        throw new Error(
          data?.message ||
            "Failed to save download."
        );
      }

      const wasEditing = Boolean(editingId);

      resetForm();

      await loadDownloads();

      setSuccess(
        wasEditing
          ? "Download updated successfully."
          : "Download added successfully."
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function startEditing(download: Download) {
    setError("");
    setSuccess("");

    setEditingId(download._id);
    setTitle(download.title);
    setFile(null);
    setPublished(download.published);

    const fileInput = document.getElementById(
      "download-file"
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteDownload(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this download?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const data = await response
          .json()
          .catch(() => null);

        throw new Error(
          data?.message ||
            "Failed to delete download."
        );
      }

      if (editingId === id) {
        resetForm();
      }

      await loadDownloads();

      setSuccess(
        "Download deleted successfully."
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Could not delete download."
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Page heading */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Downloads
          </h1>

          <p className="mt-2 text-gray-500">
            Add, edit and delete downloads.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="my-8 rounded-xl bg-white p-5 shadow-sm sm:p-7"
        >
          <h2 className="mb-5 text-xl font-semibold text-gray-800">
            {editingId
              ? "Edit Download"
              : "Add Download"}
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Title */}
            <div>
              <label
                htmlFor="download-title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Particular Description
              </label>

              <input
                id="download-title"
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Download title"
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
              />
            </div>

            {/* File */}
            <div>
              <label
                htmlFor="download-file"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                File
              </label>

              <input
                id="download-file"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                disabled={loading}
                onChange={(e) =>
                  setFile(
                    e.target.files?.[0] || null
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm disabled:bg-gray-100"
              />
            </div>
          </div>

          {editingId && (
            <p className="mt-2 text-xs text-gray-500">
              Leave the file empty to keep the
              current file.
            </p>
          )}

          {/* Published */}
          <label className="mt-5 flex w-fit cursor-pointer items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={published}
              disabled={loading}
              onChange={(e) =>
                setPublished(e.target.checked)
              }
              className="h-4 w-4 accent-green-700"
            />

            Published
          </label>

          {/* Success message */}
          {success && (
            <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {success}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-green-700 px-6 py-3 font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Download"
                  : "Add Download"}
            </button>

            {editingId && (
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  resetForm();
                  setError("");
                  setSuccess("");
                }}
                className="rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Downloads table */}
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[760px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                  Particular Description
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                  File
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {pageLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    Loading downloads...
                  </td>
                </tr>
              ) : downloads.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    No downloads found.
                  </td>
                </tr>
              ) : (
                downloads.map((download) => (
                  <tr
                    key={download._id}
                    className="border-t border-gray-100"
                  >
                    <td className="px-5 py-4 text-sm font-medium text-gray-800">
                      {download.title}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {download.fileUrl ? (
                        <a
                          href={`${BACKEND_URL}${download.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-green-700 hover:underline"
                        >
                          View file
                        </a>
                      ) : (
                        <span className="text-gray-400">
                          No file available
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {download.published ? (
                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                          Hidden
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            startEditing(download)
                          }
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteDownload(
                              download._id
                            )
                          }
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}