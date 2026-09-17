"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { NumberStepper } from "@/components/ui/NumberStepper";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  hasErrors,
  MAX_HOURS,
  MIN_HOURS,
  validateEntry,
} from "@/lib/validation";
import type { EntryErrors, EntryInput, ProjectsResponse } from "@/types";

interface EntryFormProps {
  initialValues: EntryInput;
  options: ProjectsResponse;
  submitLabel: string;
  /** Called with valid values. Errors from the API come back through `serverErrors`. */
  onSubmit: (values: EntryInput) => Promise<void>;
  onCancel: () => void;
  serverErrors?: EntryErrors;
  serverMessage?: string;
}

export function EntryForm({
  initialValues,
  options,
  submitLabel,
  onSubmit,
  onCancel,
  serverErrors,
  serverMessage,
}: EntryFormProps) {
  const [values, setValues] = useState<EntryInput>(initialValues);
  const [errors, setErrors] = useState<EntryErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shownErrors = { ...serverErrors, ...errors };

  function setField<K extends keyof EntryInput>(
    field: K,
    value: EntryInput[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    // Clear the error of a field as soon as the user changes it.
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateEntry(values);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ ...values, description: values.description.trim() });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {serverMessage && (
        <p
          role="alert"
          className="rounded-lg bg-danger-100 px-4 py-3 text-sm text-danger-800"
        >
          {serverMessage}
        </p>
      )}

      <div className="sm:w-80">
        <FormField
          id="projectId"
          label="Select Project"
          required
          info="The project you worked on"
          error={shownErrors.projectId}
        >
          <Select
            id="projectId"
            placeholder="Project Name"
            options={options.projects.map((p) => ({
              value: p.id,
              label: p.name,
            }))}
            value={values.projectId}
            onChange={(e) => setField("projectId", e.target.value)}
            hasError={!!shownErrors.projectId}
          />
        </FormField>
      </div>

      <div className="sm:w-80">
        <FormField
          id="workType"
          label="Type of Work"
          required
          info="What kind of work you did"
          error={shownErrors.workType}
        >
          <Select
            id="workType"
            placeholder="Select type of work"
            options={options.workTypes.map((type) => ({
              value: type,
              label: type,
            }))}
            value={values.workType}
            onChange={(e) => setField("workType", e.target.value)}
            hasError={!!shownErrors.workType}
          />
        </FormField>
      </div>

      <FormField
        id="description"
        label="Task description"
        required
        hint="A note for extra info"
        error={shownErrors.description}
      >
        <Textarea
          id="description"
          placeholder="Write text here ..."
          value={values.description}
          onChange={(e) => setField("description", e.target.value)}
          hasError={!!shownErrors.description}
        />
      </FormField>

      <FormField
        id="hours"
        label="Hours"
        required
        error={shownErrors.hours ?? shownErrors.date}
      >
        <NumberStepper
          id="hours"
          min={MIN_HOURS}
          max={MAX_HOURS}
          value={values.hours}
          onChange={(value) => setField("hours", value)}
          hasError={!!shownErrors.hours}
        />
      </FormField>

      <div className="mt-2 flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row">
        <Button type="submit" isLoading={isSubmitting} className="flex-1">
          {submitLabel}
        </Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
