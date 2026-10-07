import { ChevronLeft, ChevronRight } from "lucide-react";

import { formatDay, moveWeek } from "@/lib/employee/dashboard";

export default function WeekSelector({
  week,
  currentWeek,
  busy,
  onChange,
}: {
  week: string;
  currentWeek: string;
  busy: boolean;
  onChange: (week: string) => void;
}) {
  const navigationButton =
    "flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-ink transition-colors hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
      <button
        className={navigationButton}
        aria-label="Previous week"
        disabled={busy}
        onClick={() => onChange(moveWeek(week, -1))}
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
      </button>

      <span className="min-w-0 flex-1 text-center text-sm font-semibold text-ink sm:flex-none sm:px-2">
        Week of {formatDay(`${week}T12:00:00Z`, "UTC")} {week.slice(0, 4)}
      </span>

      <button
        className={navigationButton}
        aria-label="Next week"
        disabled={busy || week >= currentWeek}
        onClick={() => onChange(moveWeek(week, 1))}
      >
        <ChevronRight aria-hidden="true" className="size-4" />
      </button>

      <button
        className="min-h-10 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        disabled={busy || week === currentWeek}
        onClick={() => onChange(currentWeek)}
      >
        This week
      </button>
    </div>
  );
}