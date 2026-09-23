"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Layers3,
  Plus,
  Trash2,
} from "lucide-react";

import ConfirmModal from "@/components/ConfirmModal";
import RichTextEditor from "@/components/RichTextEditor";

type ServiceType = "content" | "image" | "external-link";

type ServiceGroup =
  | "savings"
  | "loans"
  | "loan-documents"
  | "digital"
  | "other";

interface Section {
  heading: string;
  content: string;
  order: number;
}

interface Service {
  _id: string;
  title: string;
  titleHtml?: string;
  slug: string;
  group: ServiceGroup;
  type: ServiceType;
  subtitle: string;
  sections: Section[];
  imageUrl: string;
  externalUrl: string;
  buttonText: string;
  order: number;
  published: boolean;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const API_URL = `${BACKEND_URL}/api/services`;

const groups: {
  value: Exclude<ServiceGroup, "other">;
  label: string;
}[] = [
  {
    value: "savings",
    label: "Deposit",
  },
  {
    value: "loans",
    label: "Loans",
  },
  {
    value: "loan-documents",
    label: "Loan Documents",
  },
  {
    value: "digital",
    label: "Digital Services",
  },
];

const types = [
  {
    value: "content" as const,
    label: "Content",
    icon: FileText,
  },
  {
    value: "image" as const,
    label: "Poster / Image",
    icon: ImageIcon,
  },
  {
    value: "external-link" as const,
    label: "External Link",
    icon: ExternalLink,
  },
];

function emptySection(order = 1): Section {
  return {
    heading: "",
    content: "",
    order,
  };
}

function htmlToText(html: string) {
  const div = document.createElement("div");

  div.innerHTML = html;

  return (div.textContent || "").trim();
}

function publicPath(service: Pick<Service, "group" | "slug">) {
  if (service.group === "other") {
    return null;
  }

  const category = service.group === "savings" ? "deposit" : service.group;

  return `/services/${category}/${service.slug}`;
}

function groupLabel(group: ServiceGroup) {
  if (group === "other") {
    return "Legacy / Other";
  }

  return groups.find((item) => item.value === group)?.label || group;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  const [titleHtml, setTitleHtml] = useState("");

  const [group, setGroup] = useState<Exclude<ServiceGroup, "other">>("savings");

  const [type, setType] = useState<ServiceType>("content");

  const [subtitle, setSubtitle] = useState("");

  const [sections, setSections] = useState<Section[]>([emptySection()]);

  const [externalUrl, setExternalUrl] = useState("");

  const [buttonText, setButtonText] = useState("Open Link");

  const [image, setImage] = useState<File | null>(null);

  const [order, setOrder] = useState(1);

  const [published, setPublished] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [filterGroup, setFilterGroup] = useState<ServiceGroup | "all">("all");

  async function loadServices() {
    try {
      const response = await fetch(API_URL, {
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Could not load services.");
      }

      setServices(await response.json());
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not load services.",
      );
    } finally {
      setPageLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  /* AUTO-HIDE SUCCESS */

  useEffect(() => {
    if (!success) {
      return;
    }

    const timer = window.setTimeout(() => setSuccess(""), 3000);

    return () => window.clearTimeout(timer);
  }, [success]);

  /* AUTO-HIDE ERROR */

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = window.setTimeout(() => setError(""), 5000);

    return () => window.clearTimeout(timer);
  }, [error]);

  const visibleServices = useMemo(() => {
    if (filterGroup === "all") {
      return services;
    }

    return services.filter((service) => service.group === filterGroup);
  }, [services, filterGroup]);

  function clearFile() {
    const input = document.getElementById(
      "service-image",
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  }

  function resetForm() {
    setTitleHtml("");
    setGroup("savings");
    setType("content");
    setSubtitle("");

    setSections([emptySection()]);

    setExternalUrl("");
    setButtonText("Open Link");

    setImage(null);
    setOrder(1);
    setPublished(true);
    setEditingId(null);

    clearFile();
  }

  function addSection() {
    setSections((current) => [...current, emptySection(current.length + 1)]);
  }

  function removeSection(index: number) {
    setSections((current) =>
      current
        .filter((_, i) => i !== index)
        .map((section, i) => ({
          ...section,
          order: i + 1,
        })),
    );
  }

  function updateSection(
    index: number,
    field: "heading" | "content",
    value: string,
  ) {
    setSections((current) =>
      current.map((section, i) =>
        i === index
          ? {
              ...section,
              [field]: value,
            }
          : section,
      ),
    );
  }

  function editService(service: Service) {
    setError("");
    setSuccess("");

    setEditingId(service._id);

    setTitleHtml(service.titleHtml || `<p>${service.title}</p>`);

    /*
      Old "other" items are legacy.
      When editing one, move it to Deposit
      unless you choose another category.
    */

    setGroup(service.group === "other" ? "savings" : service.group);

    setType(service.type);

    setSubtitle(service.subtitle || "");

    setSections(service.sections?.length ? service.sections : [emptySection()]);

    setExternalUrl(service.externalUrl || "");

    setButtonText(service.buttonText || "Open Link");

    setOrder(service.order || 1);

    setPublished(service.published);

    setImage(null);

    clearFile();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const plainTitle = htmlToText(titleHtml);

    if (!plainTitle) {
      setError("Please enter a service title.");

      return;
    }

    if (type === "external-link" && !externalUrl.trim()) {
      setError("Please enter the external URL.");

      return;
    }

    const formData = new FormData();

    formData.append("title", plainTitle);

    formData.append("titleHtml", titleHtml);

    formData.append("group", group);

    formData.append("type", type);

    formData.append("subtitle", subtitle.trim());

    formData.append("sections", JSON.stringify(sections));

    formData.append("externalUrl", externalUrl.trim());

    formData.append("buttonText", buttonText.trim());

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
        throw new Error(data?.message || "Could not save service.");
      }

      resetForm();

      await loadServices();

      setSuccess(
        wasEditing
          ? "Service updated successfully."
          : "Service added successfully.",
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not save service.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteService() {
    if (!deleteId) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/${deleteId}`, {
        method: "DELETE",

        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Could not delete service.");
      }

      if (editingId === deleteId) {
        resetForm();
      }

      setDeleteId(null);

      await loadServices();

      setSuccess("Service deleted successfully.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not delete service.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f8f7] px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1F3C88]">
            Credits and Savings Vyas CMS
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950">
            Services
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create and manage Deposit, Loan, Documents and Digital services.
          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mt-6 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
        >
          {/* FORM HEADER */}

          <div className="flex flex-col gap-3 border-b bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-bold text-gray-900">
                {editingId ? "Edit Service" : "New Service"}
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Fill only the information required for this service.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-fit rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {/* FORM GRID */}

          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_280px]">
            {/* LEFT CONTENT */}

            <div className="space-y-5">
              {/* CATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Category
                </label>

                <div className="flex flex-wrap gap-2">
                  {groups.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setGroup(item.value)}
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                        group === item.value
                          ? "bg-[#1F3C88] text-white"
                          : "border border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TITLE */}

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Service Title
                </label>

                <RichTextEditor
                  variant="title"
                  value={titleHtml}
                  onChange={setTitleHtml}
                />
              </div>

              {/* SUBTITLE */}

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Subtitle / Short Description
                </label>

                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(event) => setSubtitle(event.target.value)}
                  placeholder="A short explanation shown below the title."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* CONTENT TYPE */}

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Content Type
                </label>

                <div className="flex flex-wrap gap-2">
                  {types.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setType(item.value)}
                        className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                          type === item.value
                            ? "border-green-700 bg-[#1F3C88] text-white"
                            : "border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50"
                        }`}
                      >
                        <Icon size={16} />

                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CONTENT SECTIONS */}

              {type === "content" && (
                <div>
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-700">
                        Information Sections
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        Create headings, paragraphs, bullets and numbered lists.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addSection}
                      className="flex w-fit items-center gap-1.5 rounded-xl bg-green-50 px-3 py-2 text-xs font-bold text-[#1F3C88] transition hover:bg-green-100"
                    >
                      <Plus size={14} />
                      Add Section
                    </button>
                  </div>

                  <div className="space-y-4">
                    {sections.map((section, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:p-4"
                      >
                        {/* SECTION HEADER */}

                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-xs font-bold text-[#1F3C88]">
                            {index + 1}
                          </div>

                          <input
                            value={section.heading}
                            onChange={(event) =>
                              updateSection(
                                index,
                                "heading",
                                event.target.value,
                              )
                            }
                            placeholder="Section heading, e.g. उद्देश्यहरू"
                            className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none transition focus:border-green-500"
                          />

                          {sections.length > 1 && (
                            <button
                              type="button"
                              title="Remove section"
                              onClick={() => removeSection(index)}
                              className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        {/* COMPACT RICH EDITOR */}

                        <div className="mt-3">
                          <RichTextEditor
                            variant="compact"
                            value={section.content}
                            onChange={(value) =>
                              updateSection(index, "content", value)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* IMAGE TYPE */}

              {type === "image" && (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <label className="text-sm font-bold text-gray-700">
                    Service Image / Poster
                  </label>

                  <p className="mt-1 text-xs text-gray-400">
                    Upload a JPG, PNG or WebP poster.
                  </p>

                  <input
                    id="service-image"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(event) =>
                      setImage(event.target.files?.[0] || null)
                    }
                    className="mt-3 block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-[#1F3C88] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
                  />
                </div>
              )}

              {/* EXTERNAL TYPE */}

              {type === "external-link" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      External URL
                    </label>

                    <input
                      value={externalUrl}
                      onChange={(event) => setExternalUrl(event.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Button Text
                    </label>

                    <input
                      value={buttonText}
                      onChange={(event) => setButtonText(event.target.value)}
                      placeholder="Open Link"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SETTINGS */}

            <aside>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <h3 className="text-sm font-bold text-gray-900">Settings</h3>

                {/* PUBLISHED */}

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Published
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      Visible on website
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPublished(!published)}
                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                      published ? "bg-[#1F3C88]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                        published ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* ORDER */}

                <div className="mt-5 border-t border-gray-200 pt-4">
                  <label className="text-sm font-semibold text-gray-700">
                    Display Order
                  </label>

                  <input
                    type="number"
                    min={1}
                    value={order}
                    onChange={(event) =>
                      setOrder(Number(event.target.value) || 1)
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    Smaller numbers appear first.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          {/* SAVE BAR */}

          <div className="flex flex-col gap-3 border-t bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#1F3C88] px-7 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#162E6A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Service"
                  : "Create Service"}
            </button>
          </div>

          {/* MESSAGES */}

          {(success || error) && (
            <div className="border-t px-5 py-4 sm:px-6">
              {success && (
                <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-[#1F3C88]">
                  {success}
                </div>
              )}

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}
            </div>
          )}
        </form>

        {/* EXISTING SERVICES */}

        <section className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Existing Services
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {services.length}{" "}
                {services.length === 1 ? "service" : "services"} in total.
              </p>
            </div>

            {/* FILTERS */}

            <div className="flex flex-wrap gap-2">
              <Filter
                active={filterGroup === "all"}
                onClick={() => setFilterGroup("all")}
              >
                All
              </Filter>

              {groups.map((item) => (
                <Filter
                  key={item.value}
                  active={filterGroup === item.value}
                  onClick={() => setFilterGroup(item.value)}
                >
                  {item.label}
                </Filter>
              ))}
            </div>
          </div>

          {/* LIST */}

          {pageLoading ? (
            <div className="mt-4 rounded-2xl border bg-white p-10 text-center text-sm text-gray-400">
              Loading services...
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {visibleServices.map((service, index) => {
                const viewPath = publicPath(service);

                return (
                  <article
                    key={service._id}
                    className={`flex flex-col gap-4 p-4 transition hover:bg-gray-50 sm:flex-row sm:items-center ${
                      index !== visibleServices.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    {/* ICON */}

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#1F3C88]">
                      <Layers3 size={18} />
                    </div>

                    {/* INFO */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-bold text-gray-900">
                          {service.title}
                        </h3>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            service.published
                              ? "bg-green-50 text-[#1F3C88]"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {service.published ? "Published" : "Hidden"}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-gray-400">
                        {groupLabel(service.group)} · {service.type}
                      </p>

                      {service.subtitle && (
                        <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                          {service.subtitle}
                        </p>
                      )}
                    </div>

                    {/* ACTIONS */}

                    <div className="flex shrink-0 flex-wrap gap-2">
                      {service.published && viewPath && (
                        <Link
                          href={viewPath}
                          target="_blank"
                          className="rounded-xl border border-green-200 bg-white px-3 py-2 text-sm font-semibold text-[#1F3C88] transition hover:bg-green-50"
                        >
                          View
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => editService(service)}
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteId(service._id)}
                        className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}

              {visibleServices.length === 0 && (
                <div className="p-10 text-center text-sm text-gray-400">
                  No services in this category.
                </div>
              )}
            </div>
          )}
        </section>

        {/* DELETE MODAL */}

        <ConfirmModal
          open={Boolean(deleteId)}
          title="Delete this service?"
          description="This service will be permanently removed from the website."
          loading={deleting}
          onCancel={() => setDeleteId(null)}
          onConfirm={deleteService}
        />
      </div>
    </main>
  );
}

function Filter({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
        active
          ? "bg-[#1F3C88] text-white"
          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}
