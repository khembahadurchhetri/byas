"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

interface Report {
  _id: string;
  title: string;
  fileUrl: string;
  reportDate?: string;
  published: boolean;
  createdAt: string;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const API_URL =
  `${BACKEND_URL}/api/reports`;

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function toDateInputValue(value?: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
}

async function getErrorMessage(
  response: Response,
  fallback: string
) {
  try {
    const data = await response.json();

    return (
      data?.message ||
      data?.error ||
      `${fallback} (${response.status})`
    );
  } catch {
    try {
      const text = await response.text();

      return (
        text ||
        `${fallback} (${response.status})`
      );
    } catch {
      return `${fallback} (${response.status})`;
    }
  }
}

export default function AdminReportsPage() {
  const [reports, setReports] =
    useState<Report[]>([]);

  const [title, setTitle] =
    useState("");

  const [
    reportDate,
    setReportDate,
  ] = useState("");

  const [file, setFile] =
    useState<File | null>(
      null
    );

  const [
    published,
    setPublished,
  ] = useState(true);

  const [
    editingId,
    setEditingId,
  ] =
    useState<string | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [
    loadingReports,
    setLoadingReports,
  ] = useState(true);

  const [
    message,
    setMessage,
  ] = useState("");

  const [error, setError] =
    useState("");

  async function loadReports() {
    try {
      setLoadingReports(true);

      const response =
        await fetch(API_URL, {
          cache: "no-store",
          credentials: "include",
        });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(
            response,
            "Failed to load reports"
          )
        );
      }

      const data =
        await response.json();

      setReports(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Load reports error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Could not load reports."
      );
    } finally {
      setLoadingReports(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!title.trim()) {
      setError(
        "Report title is required."
      );

      return;
    }

    if (!reportDate) {
      setError(
        "Report date is required."
      );

      return;
    }

    if (!editingId && !file) {
      setError(
        "Please select a PDF file."
      );

      return;
    }

    const formData =
      new FormData();

    formData.append(
      "title",
      title.trim()
    );

    formData.append(
      "reportDate",
      reportDate
    );

    formData.append(
      "published",
      String(published)
    );

    if (file) {
      formData.append(
        "file",
        file
      );
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          editingId
            ? `${API_URL}/${editingId}`
            : API_URL,
          {
            method: editingId
              ? "PATCH"
              : "POST",

            credentials:
              "include",

            body: formData,
          }
        );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(
            response,
            editingId
              ? "Failed to update report"
              : "Failed to create report"
          )
        );
      }

      setMessage(
        editingId
          ? "Report updated successfully."
          : "Report added successfully."
      );

      resetForm();

      await loadReports();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Save report error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function startEditing(
    report: Report
  ) {
    setEditingId(
      report._id
    );

    setTitle(
      report.title
    );

    setReportDate(
      toDateInputValue(
        report.reportDate ||
          report.createdAt
      )
    );

    setFile(null);

    setPublished(
      report.published
    );

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setReportDate("");
    setFile(null);
    setPublished(true);
    setError("");
  }

  async function deleteReport(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Delete this report?"
      );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response =
        await fetch(
          `${API_URL}/${id}`,
          {
            method: "DELETE",
            credentials:
              "include",
          }
        );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(
            response,
            "Failed to delete report"
          )
        );
      }

      if (editingId === id) {
        resetForm();
      }

      setMessage(
        "Report deleted successfully."
      );

      await loadReports();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Delete report error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Could not delete report."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f8fc] py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* HEADER */}

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1F3C88]">
            Byas SACCOS CMS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Manage Reports
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Add, update and publish
            cooperative reports and PDF
            documents.
          </p>
        </div>

        {/* SUCCESS */}

        {message && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="my-7 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="flex flex-col gap-2 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {editingId
                  ? "Edit Report"
                  : "Add Report"}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Enter report information
                and upload its PDF file.
              </p>
            </div>

            {editingId && (
              <span className="w-fit rounded-full bg-[#EEF4FF] px-3 py-1 text-xs font-semibold text-[#1F3C88]">
                Editing
              </span>
            )}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {/* TITLE */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Report Title{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="e.g. Annual Report 2082/83"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1F3C88] focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* DATE */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Report Date{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="date"
                value={reportDate}
                onChange={(event) =>
                  setReportDate(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#1F3C88] focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1 text-xs text-gray-400">
                Select the actual report
                or publication date.
              </p>
            </div>

            {/* PDF */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                PDF File

                {!editingId && (
                  <span className="text-red-500">
                    {" "}
                    *
                  </span>
                )}
              </label>

              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) =>
                  setFile(
                    event.target
                      .files?.[0] ||
                      null
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#EEF4FF] file:px-4 file:py-2 file:font-semibold file:text-[#1F3C88]"
              />

              {file && (
                <p className="mt-2 text-xs font-medium text-[#1F3C88]">
                  Selected: {file.name}
                </p>
              )}

              {editingId && (
                <p className="mt-2 text-xs text-gray-400">
                  Leave PDF empty to keep
                  the current file.
                </p>
              )}
            </div>
          </div>

          {/* PUBLISHED */}

          <label className="mt-5 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(event) =>
                setPublished(
                  event.target.checked
                )
              }
              className="mt-1 h-4 w-4 accent-[#1F3C88]"
            />

            <div>
              <p className="text-sm font-semibold text-gray-700">
                Published
              </p>

              <p className="text-xs text-gray-400">
                Published reports are
                visible on the public
                website.
              </p>
            </div>
          </label>

          {/* BUTTONS */}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#1F3C88] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#162E6A] disabled:cursor-not-allowed disabled:opacity-50"
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
                className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* REPORT LIST */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-bold text-gray-900">
              Existing Reports
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              {reports.length}{" "}
              report
              {reports.length === 1
                ? ""
                : "s"}{" "}
              found.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-[#F8FAFF]">
                <tr className="text-sm text-gray-600">
                  <th className="px-5 py-4 text-left font-semibold">
                    Report
                  </th>

                  <th className="px-5 py-4 text-left font-semibold">
                    Date
                  </th>

                  <th className="px-5 py-4 text-left font-semibold">
                    PDF
                  </th>

                  <th className="px-5 py-4 text-left font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loadingReports ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-sm text-gray-400"
                    >
                      Loading reports...
                    </td>
                  </tr>
                ) : reports.length >
                  0 ? (
                  reports.map(
                    (report) => (
                      <tr
                        key={report._id}
                        className="transition hover:bg-[#F8FAFF]"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-800">
                            {report.title}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-500">
                          {formatDate(
                            report.reportDate ||
                              report.createdAt
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {report.fileUrl ? (
                            <a
                              href={`${BACKEND_URL}${report.fileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-[#1F3C88] hover:underline"
                            >
                              View PDF
                            </a>
                          ) : (
                            <span className="text-sm text-gray-400">
                              No PDF
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              report.published
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {report.published
                              ? "Published"
                              : "Hidden"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                startEditing(
                                  report
                                )
                              }
                              className="rounded-lg border border-blue-200 bg-[#EEF4FF] px-4 py-2 text-sm font-semibold text-[#1F3C88] transition hover:bg-blue-100"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteReport(
                                  report._id
                                )
                              }
                              className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-sm text-gray-400"
                    >
                      No reports found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}