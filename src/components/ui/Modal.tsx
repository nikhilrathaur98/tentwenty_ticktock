"use client";

import { useEffect, type ReactNode } from "react";
import { CloseIcon } from "@/components/ui/icons";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({
  isOpen,
  title,
  onClose,
  children,
  footer,
}: ModalProps) {
  // Close on Escape and stop the page behind the modal from scrolling.
  useEffect(() => {
    if (!isOpen) return;

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-lg bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="border-t border-gray-200 px-5 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
