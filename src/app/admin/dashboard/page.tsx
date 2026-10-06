import Link from "next/link";
import { ClockedInTable } from "@/components/admin/ClockedInTable";
import { WeeklyOverview } from "@/components/admin/WeeklyOverview";
import { findClockedInShifts, findWeekTotals } from "@/lib/db/queries/dashboard";
import {
  companyWeekFromParam,
  currentCompanyWeek,
  formatCompanyDate,
  formatCompanyTime,
  formatDuration,
  formatWeekParam,
} from "@/lib/time/company-time";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { week: weekParam } = await searchParams;
  const now = new Date();
  const currentWeek = currentCompanyWeek(now);
  const week = companyWeekFromParam(weekParam, now);
  const [shifts, totals] = await Promise.all([
    findClockedInShifts(),
    findWeekTotals(week.start, week.end),
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
  const isCurrentWeek = week.start.getTime() === currentWeek.start.getTime();
  const previousWeek = currentCompanyWeek(new Date(week.start.getTime() - 1));
  const nextWeek = currentCompanyWeek(week.end);
  const previousHref = `/admin/dashboard?week=${formatWeekParam(previousWeek.start)}`;
  const nextHref =
    nextWeek.start.getTime() === currentWeek.start.getTime()
      ? "/admin/dashboard"
      : `/admin/dashboard?week=${formatWeekParam(nextWeek.start)}`;

  return (
    <section className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Clocked in now</h2>
        <ClockedInTable rows={clockedInRows} />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              {isCurrentWeek ? "This week" : "Past week"}
            </h2>
            <p className="text-sm text-zinc-500">{weekLabel}</p>
          </div>
          <div className="flex gap-4 text-sm">
            <Link href={previousHref} className="underline">
              Previous week
            </Link>
            {isCurrentWeek ? (
              <span className="text-zinc-400">Next week</span>
            ) : (
              <Link href={nextHref} className="underline">
                Next week
              </Link>
            )}
          </div>
        </div>
        <WeeklyOverview rows={weekRows} />
      </div>
    </section>
  );
}
