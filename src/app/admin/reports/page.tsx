"use client";

import { FormEvent, useEffect, useState } from "react";

interface Report {
  _id: string;
  title: string;
  fileUrl: string;
  published: boolean;
  createdAt: string;
}

const API_URL = "http://localhost:5000/api/reports";
const BACKEND_URL = "http://localhost:5000";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [published, setPublished] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadReports() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load reports");
      }

      setReports(await response.json());
    } catch (error) {
      console.error(error);
      alert("Could not load reports.");
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch(API_URL, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load reports.");
        return response.json() as Promise<Report[]>;
      })
      .then((data) => {
        if (!controller.signal.aborted) setReports(data);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          alert(
            error instanceof Error ? error.message : "Could not load reports.",
          );
        }
      });
    return () => controller.abort();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      alert("Report title is required.");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("published", String(published));

    if (file) {
      formData.append("file", file);
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
      await loadReports();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function startEditing(report: Report) {
    setEditingId(report._id);
    setTitle(report.title);
    setFile(null);
    setPublished(report.published);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setFile(null);
    setPublished(true);
  }

  async function deleteReport(id: string) {
    if (!window.confirm("Delete this report?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      if (editingId === id) {
        resetForm();
      }

      await loadReports();
    } catch (error) {
      console.error(error);
      alert("Could not delete report.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Reports</h1>

        <p className="mt-2 text-gray-500">Add, edit and delete reports.</p>

        <form
          onSubmit={handleSubmit}
          className="my-8 rounded-lg bg-white p-5 shadow-sm sm:p-7"
        >
          <h2 className="mb-5 text-xl font-semibold">
            {editingId ? "Edit Report" : "Add Report"}
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Report title"
              className="rounded-md border border-gray-300 px-4 py-3"
            />

            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="rounded-md border border-gray-300 px-4 py-3"
            />
          </div>

          {editingId && (
            <p className="mt-2 text-xs text-gray-500">
              Leave PDF empty to keep the current file.
            </p>
          )}

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
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Report"
                  : "Add Report"}
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

        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full min-w-[760px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-left">Particular Description</th>
                <th className="px-5 py-4 text-left">PDF</th>
                <th className="px-5 py-4 text-left">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr key={report._id} className="border-t">
                  <td className="px-5 py-4">{report.title}</td>

                  <td className="px-5 py-4">
                    {report.fileUrl ? (
                      <a
                        href={`${BACKEND_URL}${report.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1F3C88] hover:underline"
                      >
                        View PDF
                      </a>
                    ) : (
                      "No PDF"
                    )}
                  </td>

                  <td className="px-5 py-4">
                    {report.published ? "Published" : "Hidden"}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEditing(report)}
                        className="rounded bg-blue-600 px-4 py-2 text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteReport(report._id)}
                        className="rounded bg-red-600 px-4 py-2 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {reports.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
