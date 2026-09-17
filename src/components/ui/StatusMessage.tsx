import { Button } from "@/components/ui/Button";

/** Shows a loading, empty or error message inside a card or table. */
export function StatusMessage({
  message,
  isError = false,
  onRetry,
}: {
  message: string;
  isError?: boolean;
  onRetry?: () => void;
}) {
  return (
    <div
      role={isError ? "alert" : "status"}
      className="flex flex-col items-center gap-3 py-12 text-center"
    >
      <p
        className={
          isError ? "text-sm text-danger-600" : "text-sm text-gray-500"
        }
      >
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
