"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

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

const API_URL = "http://localhost:5000/api/services";

const BACKEND_URL = "http://localhost:5000";

const groupOptions: {
  value: ServiceGroup;
  label: string;
  description: string;
}[] = [
  {
    value: "savings",
    label: "Deposit",
    description: "Saving and deposit schemes",
  },
  {
    value: "loans",
    label: "Loans",
    description: "Loan schemes and facilities",
  },
  {
    value: "loan-documents",
    label: "Loan Documents",
    description: "Documents required for loans",
  },
  {
    value: "digital",
    label: "Digital Services",
    description: "Digital service information and posters",
  },
  {
    value: "other",
    label: "Other",
    description: "Other service information",
  },
];

const typeOptions: {
  value: ServiceType;
  label: string;
  description: string;
}[] = [
  {
    value: "content",
    label: "Text / Sections",
    description: "Title, headings and written information",
  },
  {
    value: "image",
    label: "Image / Poster",
    description: "Upload a service poster or image",
  },
  {
    value: "external-link",
    label: "External Link",
    description: "Send visitors to another website",
  },
];

function emptySection(order = 1): Section {
  return {
    heading: "",
    content: "",
    order,
  };
}

async function fetchServices(): Promise<Service[]> {
  const response = await fetch(API_URL, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load services.");
  }

  return response.json();
}

function groupLabel(group: ServiceGroup) {
  return groupOptions.find((item) => item.value === group)?.label || group;
}

function typeLabel(type: ServiceType) {
  return typeOptions.find((item) => item.value === type)?.label || type;
}

function publicPath(service: Pick<Service, "group" | "slug">) {
  switch (service.group) {
    case "savings":
      return `/services/deposit/${service.slug}`;

    case "loans":
      return `/services/loans/${service.slug}`;

    case "loan-documents":
      return `/services/loan-documents/${service.slug}`;

    case "digital":
      return `/services/digital/${service.slug}`;

    default:
      return `/services/${service.slug}`;
  }
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  const [filterGroup, setFilterGroup] = useState<ServiceGroup | "all">("all");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");

  const [slug, setSlug] = useState("");

  const [group, setGroup] = useState<ServiceGroup>("savings");

  const [type, setType] = useState<ServiceType>("content");

  const [subtitle, setSubtitle] = useState("");

  const [sections, setSections] = useState<Section[]>([emptySection()]);

  const [externalUrl, setExternalUrl] = useState("");

  const [buttonText, setButtonText] = useState("Open Link");

  const [image, setImage] = useState<File | null>(null);

  const [currentImageUrl, setCurrentImageUrl] = useState("");

  const [order, setOrder] = useState(1);

  const [published, setPublished] = useState(true);

  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    fetchServices()
      .then((data) => {
        if (active) {
          setServices(data);
        }
      })
      .catch((error: unknown) => {
        if (!active) return;

        setError(
          error instanceof Error ? error.message : "Could not load services.",
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

  const visibleServices = useMemo(() => {
    if (filterGroup === "all") {
      return services;
    }

    return services.filter((service) => service.group === filterGroup);
  }, [services, filterGroup]);

  async function reloadServices() {
    const data = await fetchServices();

    setServices(data);
  }

  function clearFileInput() {
    const input = document.getElementById(
      "service-image",
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  }

  function resetForm() {
    setEditingId(null);

    setTitle("");
    setSlug("");
    setGroup("savings");
    setType("content");

    setSubtitle("");

    setSections([emptySection()]);

    setExternalUrl("");
    setButtonText("Open Link");

    setImage(null);
    setCurrentImageUrl("");

    setOrder(1);
    setPublished(true);

    clearFileInput();
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

    setTitle(service.title);

    setSlug(service.slug);

    setGroup(service.group);

    setType(service.type);

    setSubtitle(service.subtitle || "");

    setSections(service.sections?.length ? service.sections : [emptySection()]);

    setExternalUrl(service.externalUrl || "");

    setButtonText(service.buttonText || "Open Link");

    setCurrentImageUrl(service.imageUrl || "");

    setImage(null);

    setOrder(service.order);

    setPublished(service.published);

    clearFileInput();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (type === "external-link" && !externalUrl.trim()) {
      setError("Please enter the external URL.");
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());

    /*
     * Empty slug is allowed when
     * creating. Backend generates it
     * from the title.
     */
    formData.append("slug", slug.trim());

    formData.append("group", group);

    formData.append("type", type);

    formData.append("subtitle", subtitle.trim());

    formData.append("order", String(order));

    formData.append("published", String(published));

    formData.append("sections", JSON.stringify(sections));

    formData.append("externalUrl", externalUrl.trim());

    formData.append("buttonText", buttonText.trim());

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
        throw new Error(data?.message || "Failed to save service.");
      }

      resetForm();

      await reloadServices();

      setSuccess(
        wasEditing
          ? "Service updated successfully."
          : "Service added successfully.",
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteService(id: string) {
    if (!window.confirm("Delete this service?")) {
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
        throw new Error(data?.message || "Delete failed.");
      }

      if (editingId === id) {
        resetForm();
      }

      await reloadServices();

      setSuccess("Service deleted successfully.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Delete failed.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        {/* PAGE TITLE */}

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-green-700">
            Mahila SACCOS
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Manage Services
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
            Add and update Deposit schemes, Loans, Loan Documents and Digital
            Services.
          </p>
        </div>

        {/* EDITOR */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? "Edit Service" : "Add Service"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Choose where the service belongs, then enter its information.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-fit rounded-lg border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {/* GROUP */}

          <div className="mt-6">
            <h3 className="font-semibold text-gray-900">
              1. Where should this appear?
            </h3>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {groupOptions.map((item) => {
                const selected = group === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setGroup(item.value)}
                    className={`rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                        : "bg-white hover:border-green-300"
                    }`}
                  >
                    <div
                      className={`font-semibold ${
                        selected ? "text-green-700" : "text-gray-900"
                      }`}
                    >
                      {item.label}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BASIC INFO */}

          <div className="mt-8">
            <h3 className="font-semibold text-gray-900">
              2. Basic information
            </h3>

            <div className="mt-3 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Title / शीर्षक
                </label>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Example: नियमित बचत"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  URL name
                </label>

                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Leave empty to create automatically"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Example: regular-saving. Usually you can leave this empty.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Subtitle / Tagline
                </label>

                <textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
                />
              </div>
            </div>
          </div>

          {/* TYPE */}

          <div className="mt-8">
            <h3 className="font-semibold text-gray-900">
              3. What kind of content is this?
            </h3>

            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {typeOptions.map((item) => {
                const selected = type === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setType(item.value)}
                    className={`rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                        : "hover:border-green-300"
                    }`}
                  >
                    <div
                      className={`font-semibold ${
                        selected ? "text-green-700" : "text-gray-900"
                      }`}
                    >
                      {item.label}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CONTENT */}

          {type === "content" && (
            <div className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    4. Content sections
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Example: उद्देश्यहरू, विशेषताहरू, सेवा तथा शर्तहरू.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addSection}
                  className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
                >
                  + Add Section
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className="rounded-xl border bg-gray-50 p-4 sm:p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        Section {index + 1}
                      </span>

                      {sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSection(index)}
                          className="text-sm font-medium text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      value={section.heading}
                      onChange={(e) =>
                        updateSection(index, "heading", e.target.value)
                      }
                      placeholder="Section heading"
                      className="mt-4 w-full rounded-lg border bg-white px-4 py-3"
                    />

                    <textarea
                      value={section.content}
                      onChange={(e) =>
                        updateSection(index, "content", e.target.value)
                      }
                      rows={6}
                      placeholder={`Enter the section content.

You can write:
1. First point
2. Second point
3. Third point`}
                      className="mt-3 w-full rounded-lg border bg-white px-4 py-3"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* IMAGE */}

          {type === "image" && (
            <div className="mt-8 rounded-xl border bg-gray-50 p-5">
              <h3 className="font-semibold text-gray-900">4. Image / Poster</h3>

              {currentImageUrl && (
                <div className="mt-4">
                  <p className="mb-2 text-xs text-gray-500">Current image</p>

                  <img
                    src={`${BACKEND_URL}${currentImageUrl}`}
                    alt=""
                    className="max-h-52 rounded-lg border bg-white object-contain"
                  />
                </div>
              )}

              <input
                id="service-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="mt-4 w-full rounded-lg border bg-white px-4 py-3"
              />

              <p className="mt-2 text-xs text-gray-500">
                JPG, PNG or WebP. Maximum 50 MB.
              </p>

              {editingId && currentImageUrl && (
                <p className="mt-1 text-xs text-gray-500">
                  Leave this empty to keep the current image.
                </p>
              )}
            </div>
          )}

          {/* LINK */}

          {type === "external-link" && (
            <div className="mt-8 rounded-xl border bg-gray-50 p-5">
              <h3 className="font-semibold text-gray-900">4. External Link</h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">
                    Destination URL
                  </label>

                  <input
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-lg border bg-white px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Button Text
                  </label>

                  <input
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="Open Link"
                    className="w-full rounded-lg border bg-white px-4 py-3"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}

          <div className="mt-8">
            <h3 className="font-semibold text-gray-900">5. Display settings</h3>

            <div className="mt-3 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Display Order
                </label>

                <input
                  type="number"
                  min="1"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full rounded-xl border px-4 py-3"
                />

                <p className="mt-1 text-xs text-gray-400">
                  1 appears first, 2 second, and so on.
                </p>
              </div>

              <div className="flex items-center">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border bg-gray-50 px-5 py-4">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="h-4 w-4"
                  />

                  <div>
                    <div className="font-medium">Published</div>

                    <div className="text-xs text-gray-500">
                      Visible on the public website
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* FEEDBACK */}

          {error && (
            <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* SAVE */}

          <div className="mt-6 flex flex-wrap gap-3 border-t pt-6">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Service"
                  : "Add Service"}
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
        </form>

        {/* EXISTING SERVICES */}

        <section className="mt-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Existing Services
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Edit, view or delete existing service information.
              </p>
            </div>

            {/* FILTER */}

            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={filterGroup === "all"}
                onClick={() => setFilterGroup("all")}
              >
                All
              </FilterButton>

              {groupOptions.map((item) => (
                <FilterButton
                  key={item.value}
                  active={filterGroup === item.value}
                  onClick={() => setFilterGroup(item.value)}
                >
                  {item.label}
                </FilterButton>
              ))}
            </div>
          </div>

          {pageLoading ? (
            <div className="mt-5 rounded-xl border bg-white p-10 text-center text-gray-500">
              Loading...
            </div>
          ) : visibleServices.length > 0 ? (
            <div className="mt-5 grid gap-4">
              {visibleServices.map((service) => (
                <article
                  key={service._id}
                  className="rounded-2xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="break-words text-lg font-bold text-gray-900">
                          {service.title}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            service.published
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {service.published ? "Published" : "Hidden"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-medium text-green-700">
                        {groupLabel(service.group)}
                      </p>

                      <p className="mt-1 break-all text-xs text-gray-400">
                        {publicPath(service)}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                          {typeLabel(service.type)}
                        </span>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
                          Order {service.order}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {service.published && (
                        <Link
                          href={publicPath(service)}
                          target="_blank"
                          className="rounded-lg border border-green-700 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
                        >
                          View
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => editService(service)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteService(service._id)}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border bg-white p-10 text-center text-gray-500">
              No services found in this category.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function FilterButton({
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
      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-green-700 text-white"
          : "border bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}
