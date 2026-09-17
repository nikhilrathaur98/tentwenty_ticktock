interface ProgressBarProps {
  value: number;
  max: number;
}

export function ProgressBar({ value, max }: ProgressBarProps) {
  const percent = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="w-full sm:w-48">
      <div className="mb-1 flex items-end justify-between gap-2">
        <span className="rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-900 shadow">
          {value}/{max} hrs
        </span>
        <span className="text-xs text-gray-500">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label="Hours logged this week"
        className="h-1.5 w-full rounded-full bg-gray-200"
      >
        <div
          className="h-1.5 rounded-full bg-orange-400"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
