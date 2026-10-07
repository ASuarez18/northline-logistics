import type { ClockState } from "@/lib/employee/dashboard";
import { formatTime } from "@/lib/employee/dashboard";
import ClockTimer from "./ClockTimer";

export default function ClockStatus({
  status,
}: {
  status: ClockState | null;
}) {
  const shift = status?.openShift;

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[1.8px] text-muted">
        Your current shift
      </p>

      <h2 className="mt-4 flex items-center gap-2.5 font-heading text-xl font-bold text-ink">
        <span
          aria-hidden
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${
            shift ? "bg-success" : "bg-border"
          }`}
        />

        {!status
          ? "Status unavailable"
          : shift
            ? `Clocked in since ${formatTime(shift.clockIn, status.timeZone)}`
            : "Clocked out"}
      </h2>

      {shift && status ? (
        <ClockTimer
          key={`${shift.id}-${status.serverTime}`}
          clockIn={shift.clockIn}
          serverTime={status.serverTime}
        />
      ) : (
        <p className="my-6 max-w-lg text-sm leading-6 text-muted sm:text-base">
          {status
            ? "Ready when you are. Clock in to start your shift."
            : "Your status will appear once your dashboard is connected."}
        </p>
      )}
    </div>
  );
}