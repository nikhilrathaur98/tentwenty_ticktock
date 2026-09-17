"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { apiFetch } from "@/lib/api-client";
import type { Entry } from "@/types";

interface DeleteEntryDialogProps {
  entry: Entry;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteEntryDialog({
  entry,
  onClose,
  onDeleted,
}: DeleteEntryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setIsDeleting(true);
    setError("");
    try {
      await apiFetch(`/api/entries/${entry.id}`, { method: "DELETE" });
      onDeleted();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete the entry.",
      );
      setIsDeleting(false);
    }
  }

  return (
    <Modal
      isOpen
      title="Delete entry"
      onClose={onClose}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="danger"
            className="flex-1"
            isLoading={isDeleting}
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
        </div>
      }
    >
      <p className="text-sm text-gray-500">
        Are you sure you want to delete{" "}
        <span className="font-medium text-gray-900">{entry.description}</span>?
        This cannot be undone.
      </p>
      {error && (
        <p role="alert" className="mt-3 text-sm text-danger-600">
          {error}
        </p>
      )}
    </Modal>
  );
}
