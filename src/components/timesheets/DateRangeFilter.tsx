"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronDownIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/Input";
import { useClickOutside } from "@/hooks/useClickOutside";
import { formatShortDate } from "@/lib/dates";

interface DateRangeFilterProps {
  from?: string;
  to?: string;
  onChange: (range: { from?: string; to?: string }) => void;
}

export function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState(from ?? "");
  const [draftTo, setDraftTo] = useState(to ?? "");
  const [error, setError] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setIsOpen(false), []);

  useClickOutside(ref, close, isOpen);

  const label =
    from || to
      ? `${from ? formatShortDate(from) : "Start"} - ${to ? formatShortDate(to) : "End"}`
      : "Date Range";

  function apply() {
    if (draftFrom && draftTo && draftFrom > draftTo) {
      setError("Start date must be before end date.");
      return;
    }
    setError("");
    onChange({ from: draftFrom || undefined, to: draftTo || undefined });
    close();
  }

  function clear() {
    setDraftFrom("");
    setDraftTo("");
    setError("");
    onChange({});
    close();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-12 w-full items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-500 hover:bg-gray-50 sm:w-44"
      >
        <span className={from || to ? "text-gray-900" : undefined}>
          {label}
        </span>
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Choose date range"
          className="absolute left-0 z-20 mt-2 flex w-72 flex-col gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-lg"
        >
          <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
            From
            <Input
              type="date"
              min="2024-01-01"
              max="2024-12-31"
              value={draftFrom}
              onChange={(e) => setDraftFrom(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
            To
            <Input
              type="date"
              min="2024-01-01"
              max="2024-12-31"
              value={draftTo}
              onChange={(e) => setDraftTo(e.target.value)}
            />
          </label>
          {error && <p className="text-xs text-danger-600">{error}</p>}
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={clear}>
              Clear
            </Button>
            <Button className="flex-1" onClick={apply}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
