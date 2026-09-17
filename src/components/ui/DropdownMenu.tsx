"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/cn";

export interface DropdownItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

interface DropdownMenuProps {
  trigger: ReactNode;
  triggerLabel: string;
  items: DropdownItem[];
  triggerClassName?: string;
}

export function DropdownMenu({
  trigger,
  triggerLabel,
  items,
  triggerClassName,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setIsOpen(false), []);

  useClickOutside(ref, close, isOpen);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={triggerLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={triggerClassName}
      >
        {trigger}
      </button>

      {isOpen && (
        <ul
          role="menu"
          className="absolute right-0 z-20 mt-1 min-w-32 rounded-lg border border-gray-100 bg-white py-1 shadow-lg"
        >
          {items.map((item) => (
            <li key={item.label} role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  close();
                  item.onClick();
                }}
                className={cn(
                  "block w-full px-4 py-2 text-left text-sm hover:bg-gray-100",
                  item.danger ? "text-danger-600" : "text-gray-700",
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
