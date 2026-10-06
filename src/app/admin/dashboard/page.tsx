import { ClockedInTable } from "@/components/admin/ClockedInTable";
import { WeeklyOverview } from "@/components/admin/WeeklyOverview";
import {
  findClockedInShifts,
  findCurrentWeekTotals,
} from "@/lib/db/queries/dashboard";
import {
  currentCompanyWeek,
  formatCompanyDate,
  formatCompanyTime,
  formatDuration,
} from "@/lib/time/company-time";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const week = currentCompanyWeek();
  const [shifts, totals] = await Promise.all([
    findClockedInShifts(),
    findCurrentWeekTotals(week.start, week.end),
  ]);
  const clockedInRows = shifts.map((shift) => ({
    id: shift.id,
    name: `${shift.user.firstName} ${shift.user.lastName}`,
    clockedInAt: formatCompanyTime(shift.clockIn),
  }));
  const weekRows = totals.map((total) => ({
    id: total.id,
    name: `${total.firstName} ${total.lastName}`,
    total: formatDuration(total.totalSeconds),
  }));
  const weekLabel = `${formatCompanyDate(week.start)} – ${formatCompanyDate(new Date(week.end.getTime() - 1))}`;

  return (
    <section className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Clocked in now</h2>
        <ClockedInTable rows={clockedInRows} />
      </div>
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-semibold">This week</h2>
          <p className="text-sm text-zinc-500">{weekLabel}</p>
        </div>
        <WeeklyOverview rows={weekRows} />
      </div>
    </section>
  );
}
