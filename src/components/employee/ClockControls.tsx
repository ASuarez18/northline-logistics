import type { ClockState } from "@/lib/employee/dashboard";

export default function ClockControls({ status, busy, onClock }: {
  status: ClockState | null; busy: boolean; onClock: (action: "clock-in" | "clock-out") => void;
}) {
  const button = "rounded-xl px-6 py-3 font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";
  return <div>
    <div className="grid grid-cols-2 gap-3">
      <button className={`${button} bg-emerald-700 text-white hover:bg-emerald-800`} disabled={busy || !status?.canClockIn || !!status.openShift} onClick={() => onClock("clock-in")}>Clock In</button>
      <button className={`${button} bg-slate-900 text-white hover:bg-slate-700`} disabled={busy || !status?.canClockOut || !status.openShift} onClick={() => onClock("clock-out")}>Clock Out</button>
    </div>
    {status?.restriction && <p className="mt-4 text-sm text-amber-800">{status.restriction}</p>}
  </div>;
}
