"use client";

import { FormEvent, useEffect, useState } from "react";

interface TeamMember {
  _id: string;
  name: string;
  position: string;
  imageUrl: string;
  group: "board" | "audit" | "management";
  order: number;
  published: boolean;
}

const API_URL = "http://localhost:5000/api/team";

const BACKEND_URL = "http://localhost:5000";

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");

  const [group, setGroup] = useState<TeamMember["group"]>("board");

  const [order, setOrder] = useState(0);

  const [published, setPublished] = useState(true);

  const [image, setImage] = useState<File | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadMembers() {
    try {
      const response = await fetch(API_URL, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load team members.");
      }

      const data: TeamMember[] = await response.json();

      setMembers(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not load team members.",
      );
    } finally {
      setPageLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch(API_URL, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load team.");
        return response.json() as Promise<TeamMember[]>;
      })
      .then((data) => {
        if (!controller.signal.aborted) setMembers(data);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            error instanceof Error ? error.message : "Could not load team.",
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
      "team-image",
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  }

  function resetForm() {
    setName("");
    setPosition("");
    setGroup("board");
    setOrder(0);
    setPublished(true);
    setImage(null);
    setEditingId(null);

    clearImageInput();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name / नाम is required.");
      return;
    }

    if (!position.trim()) {
      setError("Position / पद is required.");
      return;
    }

    const formData = new FormData();

    formData.append("name", name.trim());
    formData.append("position", position.trim());
    formData.append("group", group);

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
        throw new Error(data?.message || "Failed to save team member.");
      }

      resetForm();

      await loadMembers();

      setSuccess(
        wasEditing
          ? "Team member updated successfully."
          : "Team member added successfully.",
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  function editMember(member: TeamMember) {
    setError("");
    setSuccess("");

    setEditingId(member._id);
    setName(member.name);
    setPosition(member.position);
    setGroup(member.group);
    setOrder(member.order);
    setPublished(member.published);

    setImage(null);
    clearImageInput();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteMember(id: string) {
    const confirmed = window.confirm("Delete this team member?");

    if (!confirmed) {
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
        throw new Error(data?.message || "Failed to delete team member.");
      }

      if (editingId === id) {
        resetForm();
      }

      await loadMembers();

      setSuccess("Team member deleted successfully.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Delete failed.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Manage Team
        </h1>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Manage Board, Audit Committee and Management Team from one place.
        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="my-8 rounded-2xl bg-white p-4 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800">
            {editingId ? "Edit Member" : "Add Member"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Name and position can be entered in English or Nepali.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {/* Name */}
            <div>
              <label
                htmlFor="member-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Name / नाम
              </label>

              <input
                id="member-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name / नाम"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:→
border-[#1F3C88]"
              />
            </div>

            {/* Position */}
            <div>
              <label
                htmlFor="member-position"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Position / पद
              </label>

              <input
                id="member-position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Position / पद"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:→
border-[#1F3C88]"
              />
            </div>

            {/* Group */}
            <div>
              <label
                htmlFor="member-group"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Team Group
              </label>

              <select
                id="member-group"
                value={group}
                onChange={(e) =>
                  setGroup(e.target.value as TeamMember["group"])
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:→
border-[#1F3C88]"
              >
                <option value="board">Board of Directors</option>

                <option value="audit">Audit Committee</option>

                <option value="management">Management Team</option>
              </select>
            </div>

            {/* Order */}
            <div>
              <label
                htmlFor="member-order"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Display Order
              </label>

              <input
                id="member-order"
                type="number"
                min="0"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:→
border-[#1F3C88]"
              />
            </div>

            {/* Photo */}
            <div className="md:col-span-2">
              <label
                htmlFor="team-image"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Member Photo
              </label>

              <input
                id="team-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />

              <p className="mt-2 text-xs text-gray-500">
                JPG, PNG or WebP. Maximum upload size: 50 MB.
              </p>

              {editingId && (
                <p className="mt-1 text-xs text-gray-500">
                  Leave photo empty to keep the current image.
                </p>
              )}
            </div>
          </div>

          {/* Published */}
          <label className="mt-5 flex w-fit cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4"
            />

            <span className="text-sm text-gray-700">Published</span>
          </label>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mt-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-[#1F3C88]">
              {success}
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#1F3C88] px-6 py-3 font-medium text-white transition hover:bg-[#162E6A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Member"
                  : "Add Member"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setError("");
                  setSuccess("");
                }}
                className="rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* MEMBERS */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Team Members</h2>

          {!pageLoading && (
            <span className="text-sm text-gray-500">
              {members.length} member
              {members.length === 1 ? "" : "s"}
            </span>
          )}
        </div>

        {pageLoading ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500">
            Loading team members...
          </div>
        ) : (
          <div className="grid gap-4">
            {members.map((member) => (
              <div
                key={member._id}
                className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center"
              >
                {/* Photo */}
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  {member.imageUrl ? (
                    <img
                      src={`${BACKEND_URL}${member.imageUrl}`}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-2 text-center text-xs text-gray-400">
                      No photo
                    </div>
                  )}
                </div>

                {/* Information */}
                <div className="min-w-0 flex-1">
                  <h3 className="break-words text-lg font-semibold text-gray-800">
                    {member.name}
                  </h3>

                  <p className="mt-1 break-words text-sm font-medium text-[#1F3C88]">
                    {member.position}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-[#1F3C88]">
                      {member.group === "board"
                        ? "Board"
                        : member.group === "audit"
                          ? "Audit Committee"
                          : "Management"}
                    </span>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
                      Order: {member.order}
                    </span>

                    <span
                      className={
                        member.published
                          ? "rounded-full bg-green-50 px-3 py-1 text-[#1F3C88]"
                          : "rounded-full bg-gray-100 px-3 py-1 text-gray-600"
                      }
                    >
                      {member.published ? "Published" : "Hidden"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex w-full gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => editMember(member)}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:flex-none"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteMember(member._id)}
                    className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 sm:flex-none"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {members.length === 0 && (
              <div className="rounded-xl bg-white p-10 text-center text-gray-500">
                No team members added yet.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
