import type { ClockState } from "@/lib/employee/dashboard";
import { formatTime } from "@/lib/employee/dashboard";
import ClockTimer from "./ClockTimer";

export default function ClockStatus({ status }: { status: ClockState | null }) {
  const shift = status?.openShift;
  return <div>
    <p className="text-sm font-medium uppercase tracking-widest text-slate-500">Your current shift</p>
    <h2 className="mt-4 flex items-center gap-2 text-xl font-semibold">
      <span aria-hidden className={`h-3 w-3 rounded-full ${shift ? "bg-emerald-500" : "bg-slate-300"}`} />
      {!status ? "Status unavailable" : shift ? `Clocked in since ${formatTime(shift.clockIn, status.timeZone)}` : "Clocked out"}
    </h2>
    {shift && status ? <ClockTimer key={`${shift.id}-${status.serverTime}`} clockIn={shift.clockIn} serverTime={status.serverTime} />
      : <p className="my-6 text-slate-500">{status ? "Ready when you are. Clock in to start your shift." : "Your status will appear once your dashboard is connected."}</p>}
  </div>;
}
