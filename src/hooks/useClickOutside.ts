import { useEffect, type RefObject } from "react";

/** Calls `onOutside` when the user clicks outside `ref` or presses Escape. */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node))
        onOutside();
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onOutside();
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [ref, onOutside, enabled]);
}
