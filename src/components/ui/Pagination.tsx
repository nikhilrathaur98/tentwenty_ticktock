import { cn } from "@/lib/cn";

/**
 * Page numbers to show, with "..." for gaps.
 * e.g. current 3 of 99 -> [1, 2, 3, 4, 5, 6, 7, 8, "...", 99]
 */
export function getPageNumbers(
  current: number,
  total: number,
): Array<number | "..."> {
  const maxVisible = 8;
  if (total <= maxVisible + 1) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current < maxVisible - 2) {
    return [
      ...Array.from({ length: maxVisible }, (_, i) => i + 1),
      "...",
      total,
    ];
  }
  if (current > total - (maxVisible - 3)) {
    return [
      1,
      "...",
      ...Array.from(
        { length: maxVisible },
        (_, i) => total - maxVisible + i + 1,
      ),
    ];
  }
  return [
    1,
    "...",
    current - 2,
    current - 1,
    current,
    current + 1,
    current + 2,
    "...",
    total,
  ];
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const buttonClass =
    "flex h-9 min-w-10 items-center justify-center border-l border-gray-200 px-3 text-sm first:border-l-0 disabled:cursor-not-allowed disabled:text-gray-400";

  return (
    <nav aria-label="Pagination" className="max-w-full overflow-x-auto">
      <div className="inline-flex rounded-lg border border-gray-200 bg-white">
        <button
          type="button"
          className={cn(
            buttonClass,
            "rounded-l-lg text-gray-900 hover:bg-gray-100",
          )}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>

        {getPageNumbers(page, totalPages).map((item, index) =>
          item === "..." ? (
            <span
              key={`gap-${index}`}
              className={cn(buttonClass, "text-gray-500")}
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-current={item === page ? "page" : undefined}
              onClick={() => onPageChange(item)}
              className={cn(
                buttonClass,
                item === page
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-500 hover:bg-gray-100",
              )}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          className={cn(
            buttonClass,
            "rounded-r-lg text-gray-900 hover:bg-gray-100",
          )}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
