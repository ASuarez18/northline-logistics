import { formatDay, moveWeek } from "@/lib/employee/dashboard";

export default function WeekSelector({ week, currentWeek, busy, onChange }: {
  week: string; currentWeek: string; busy: boolean; onChange: (week: string) => void;
}) {
  const button = "rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-emerald-700";
  return <div className="flex flex-wrap items-center gap-2">
    <button className={button} aria-label="Previous week" disabled={busy} onClick={() => onChange(moveWeek(week, -1))}>←</button>
    <span className="px-2 text-sm">Week of {formatDay(`${week}T12:00:00Z`, "UTC")} {week.slice(0, 4)}</span>
    <button className={button} aria-label="Next week" disabled={busy || week >= currentWeek} onClick={() => onChange(moveWeek(week, 1))}>→</button>
    <button className={button} disabled={busy || week === currentWeek} onClick={() => onChange(currentWeek)}>This week</button>
  </div>;
}
