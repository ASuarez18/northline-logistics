import type { ClockState } from "@/lib/employee/dashboard";

export default function ClockControls({
  status,
  busy,
  onClock,
}: {
  status: ClockState | null;
  busy: boolean;
  onClock: (action: "clock-in" | "clock-out") => void;
}) {
  const button =
    "min-h-12 rounded-xl px-5 py-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:cursor-not-allowed disabled:bg-sand disabled:text-muted";

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          className={`${button} bg-orange text-white hover:bg-orange-dark`}
          disabled={busy || !status?.canClockIn || !!status.openShift}
          onClick={() => onClock("clock-in")}
        >
          Clock In
        </button>

        <button
          className={`${button} bg-ink text-white hover:bg-ink-2`}
          disabled={busy || !status?.canClockOut || !status.openShift}
          onClick={() => onClock("clock-out")}
        >
          Clock Out
        </button>
      </div>

      {status?.restriction && (
        <p className="mt-4 rounded-lg bg-warning-soft px-4 py-3 text-sm leading-5 text-warning">
          {status.restriction}
        </p>
      )}
    </div>
  );
}
