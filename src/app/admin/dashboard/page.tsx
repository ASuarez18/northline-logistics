import Link from "next/link";

import { ClockedInTable } from "@/components/admin/ClockedInTable";
import { WeeklyOverview } from "@/components/admin/WeeklyOverview";
import {
  findClockedInShifts,
  findWeekTotals,
} from "@/lib/db/queries/dashboard";
import {
  companyWeekFromParam,
  currentCompanyWeek,
  formatCompanyDate,
  formatCompanyDateTimeLocal,
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
    clockInLocal: formatCompanyDateTimeLocal(shift.clockIn),
  }));

  const weekRows = totals.map((total) => ({
    id: total.id,
    name: `${total.firstName} ${total.lastName}`,
    total: formatDuration(total.totalSeconds),
  }));

  const weekLabel = `${formatCompanyDate(week.start)} – ${formatCompanyDate(
    new Date(week.end.getTime() - 1),
  )}`;

  const isCurrentWeek =
    week.start.getTime() === currentWeek.start.getTime();

  const previousWeek = currentCompanyWeek(
    new Date(week.start.getTime() - 1),
  );

  const nextWeek = currentCompanyWeek(week.end);

  const previousHref =
    `/admin/dashboard?week=${formatWeekParam(previousWeek.start)}`;

  const nextHref =
    nextWeek.start.getTime() === currentWeek.start.getTime()
      ? "/admin/dashboard"
      : `/admin/dashboard?week=${formatWeekParam(nextWeek.start)}`;

  return (
    <>
      <header className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[1.7px] text-orange-dark">
          Administration
        </p>

        <h1 className="mt-2 font-heading text-[31px] font-bold tracking-[-1.1px] text-ink">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted">
          Monitor employee attendance and working hours.
        </p>
      </header>

      <div className="flex flex-col gap-8">
        <section className="rounded-[10px] border border-border bg-surface p-6">
          <div className="mb-4">
            <h2 className="font-heading text-lg font-bold text-ink">
              Clocked in now
            </h2>

            <p className="mt-1 text-sm text-muted">
              Employees who currently have an active shift.
            </p>
          </div>

          <ClockedInTable rows={clockedInRows} />
        </section>

        <section className="rounded-[10px] border border-border bg-surface p-6">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-ink">
                {isCurrentWeek ? "This week" : "Past week"}
              </h2>

              <p className="mt-1 text-sm text-muted">{weekLabel}</p>
            </div>

            <div className="flex gap-4 text-sm">
              <Link
                href={previousHref}
                className="font-medium text-orange-dark hover:underline"
              >
                Previous week
              </Link>

              {isCurrentWeek ? (
                <span className="text-muted">Next week</span>
              ) : (
                <Link
                  href={nextHref}
                  className="font-medium text-orange-dark hover:underline"
                >
                  Next week
                </Link>
              )}
            </div>
          </div>

          <WeeklyOverview rows={weekRows} />
        </section>
      </div>
    </>
  );
}