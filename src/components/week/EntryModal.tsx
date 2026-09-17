"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { EntryForm } from "@/components/week/EntryForm";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { Entry, EntryErrors, EntryInput, ProjectsResponse } from "@/types";

interface EntryModalProps {
  /** The day the entry is for. */
  date: string;
  /** Pass an entry to edit it, or leave empty to create a new one. */
  entry?: Entry;
  options: ProjectsResponse;
  onClose: () => void;
  onSaved: () => void;
}

export function EntryModal({
  date,
  entry,
  options,
  onClose,
  onSaved,
}: EntryModalProps) {
  const [serverErrors, setServerErrors] = useState<EntryErrors>();
  const [serverMessage, setServerMessage] = useState<string>();
  const isEditing = !!entry;

  const initialValues: EntryInput = entry
    ? {
        date: entry.date,
        projectId: entry.projectId,
        workType: entry.workType,
        description: entry.description,
        hours: entry.hours,
      }
    : { date, projectId: "", workType: "", description: "", hours: 1 };

  async function handleSubmit(values: EntryInput) {
    setServerErrors(undefined);
    setServerMessage(undefined);
    try {
      await apiFetch<Entry>(
        isEditing ? `/api/entries/${entry.id}` : "/api/entries",
        {
          method: isEditing ? "PUT" : "POST",
          body: JSON.stringify(values),
        },
      );
      onSaved();
      onClose();
    } catch (error) {
      if (error instanceof ApiError) {
        setServerMessage(error.message);
        setServerErrors(error.details as EntryErrors | undefined);
      } else {
        setServerMessage("Could not save the entry. Please try again.");
      }
    }
  }

  return (
    <Modal
      isOpen
      title={isEditing ? "Edit Entry" : "Add New Entry"}
      onClose={onClose}
    >
      <EntryForm
        initialValues={initialValues}
        options={options}
        submitLabel={isEditing ? "Save changes" : "Add entry"}
        onSubmit={handleSubmit}
        onCancel={onClose}
        serverErrors={serverErrors}
        serverMessage={serverMessage}
      />
    </Modal>
  );
}
