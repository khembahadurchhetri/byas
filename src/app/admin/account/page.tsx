"use client";

import { FormEvent, useState } from "react";

import { Eye, EyeOff, KeyRound } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminAccountPage() {
  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "PATCH",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Could not change password.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccess("Password changed successfully.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not change password.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold text-gray-900">Admin Account</h1>

        <p className="mt-2 text-sm text-gray-500">
          Change your administrator password.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-3 text-[#1F3C88]">
              <KeyRound size={22} />
            </div>

            <h2 className="font-bold text-gray-900">Change Password</h2>
          </div>

          <div className="mt-6 space-y-5">
            <PasswordField
              label="Current Password"
              value={currentPassword}
              setValue={setCurrentPassword}
              show={show}
            />

            <PasswordField
              label="New Password"
              value={newPassword}
              setValue={setNewPassword}
              show={show}
            />

            <PasswordField
              label="Confirm New Password"
              value={confirmPassword}
              setValue={setConfirmPassword}
              show={show}
            />

            <button
              type="button"
              onClick={() => setShow((current) => !current)}
              className="flex items-center gap-2 text-sm text-gray-500"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}

              {show ? "Hide passwords" : "Show passwords"}
            </button>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-[#1F3C88]">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#1F3C88] px-6 py-3 font-semibold text-white hover:bg-[#162E6A] disabled:opacity-50"
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function PasswordField({
  label,
  value,
  setValue,
  show,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  show: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={show ? "text" : "password"}
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:→
border-[#1F3C88]"
      />
    </div>
  );
}
