"use client";

import {
  AlertTriangle,
  X,
} from "lucide-react";

export default function ConfirmModal({
  open,
  title = "Delete item?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  loading = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

      {/* BACKDROP */}

      <button
        type="button"
        aria-label="Close confirmation"
        onClick={onCancel}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />

      {/* MODAL */}

      <div className="relative z-10 w-full max-w-md rounded-3xl border bg-white p-6 shadow-2xl">

        <button
          type="button"
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={18} />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertTriangle
            size={23}
          />
        </div>

        <h2 className="mt-5 text-xl font-bold text-gray-900">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {description}
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading
              ? "Deleting..."
              : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}