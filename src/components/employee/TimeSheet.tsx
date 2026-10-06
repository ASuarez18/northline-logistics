import { duration, formatDay, formatTime, type Timesheet } from "@/lib/employee/dashboard";

export default function TimeSheet({ timesheet, timeZone }: { timesheet: Timesheet; timeZone: string }) {
  return <div>
    <div className="my-6 flex items-baseline justify-between gap-3 border-y border-slate-100 py-4">
      <p className="text-sm text-slate-500">Completed hours this week</p>
      <p className="text-2xl font-semibold tabular-nums">{duration(timesheet.totalSeconds)}</p>
    </div>
    {timesheet.shifts.length === 0 ? <p className="py-10 text-center text-slate-500">No shifts recorded for this week.</p> :
      <div className="overflow-x-auto"><table className="w-full min-w-[480px] text-left text-sm">
        <caption className="sr-only">Your shifts for the week starting {timesheet.weekStart}. Dates use {timeZone}.</caption>
        <thead className="text-slate-500"><tr>{["Shift date", "Clock in", "Clock out", "Duration"].map((label) => <th key={label} scope="col" className="px-3 py-3 font-medium">{label}</th>)}</tr></thead>
        <tbody>{[...timesheet.shifts].sort((a, b) => a.clockIn.localeCompare(b.clockIn)).map((shift) => <tr key={shift.id} className="border-t border-slate-100">
          <th scope="row" className="px-3 py-4 font-medium">{formatDay(shift.clockIn, timeZone)}</th>
          <td className="px-3 py-4">{formatTime(shift.clockIn, timeZone)}</td>
          <td className="px-3 py-4">{shift.clockOut ? <span>{formatTime(shift.clockOut, timeZone)}{formatDay(shift.clockOut, timeZone) !== formatDay(shift.clockIn, timeZone) && <small className="block text-slate-500">{formatDay(shift.clockOut, timeZone)}</small>}</span> : <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">In progress</span>}</td>
          <td className="px-3 py-4 tabular-nums">{shift.clockOut ? duration((Date.parse(shift.clockOut) - Date.parse(shift.clockIn)) / 1000) : "—"}</td>
        </tr>)}</tbody>
      </table></div>}
    <p className="mt-5 text-xs text-slate-500">Open shifts are excluded from the total. Each shift belongs to the date it started.</p>
  </div>;
}
