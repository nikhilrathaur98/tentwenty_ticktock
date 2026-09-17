import { MinusIcon, PlusIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface NumberStepperProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  hasError?: boolean;
}

export function NumberStepper({
  id,
  value,
  onChange,
  min,
  max,
  hasError,
}: NumberStepperProps) {
  const buttonClass =
    "flex h-9 w-9 items-center justify-center bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div
      className={cn(
        "inline-flex w-fit overflow-hidden rounded-lg border",
        hasError ? "border-danger-600" : "border-gray-300",
      )}
    >
      <button
        type="button"
        aria-label="Decrease hours"
        className={buttonClass}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <MinusIcon width={12} height={12} />
      </button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={Number.isNaN(value) ? "" : value}
        onChange={(event) => onChange(event.target.valueAsNumber)}
        className="h-9 w-12 border-x border-gray-300 text-center text-sm focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Increase hours"
        className={buttonClass}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <PlusIcon width={12} height={12} />
      </button>
    </div>
  );
}
