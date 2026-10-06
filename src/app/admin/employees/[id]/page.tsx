import { EmployeeInfo } from "@/components/admin/EmployeeInfo";
import { EmployeeShifts } from "@/components/admin/EmployeeShifts";
import {
  findEmployee,
  findEmployeeShifts,
  findEmployeeWeekTotal,
} from "@/lib/db/queries/employees";
import {
  companyWeekFromParam,
  currentCompanyWeek,
  formatCompanyDate,
  formatCompanyDateTimeLocal,
  formatCompanyTime,
  formatDuration,
  formatWeekParam,
} from "@/lib/time/company-time";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EmployeeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ week?: string }>;
}) {
  const { id } = await params;
  const { week: weekParam } = await searchParams;
  const employee = await findEmployee(id);

  if (!employee) {
    notFound();
  }

  const now = new Date();
  const currentWeek = currentCompanyWeek(now);
  const week = companyWeekFromParam(weekParam, now);
  const [shifts, totalSeconds] = await Promise.all([
    findEmployeeShifts(employee.id, week.start, week.end),
    findEmployeeWeekTotal(employee.id, week.start, week.end),
  ]);
  const weekLabel = `${formatCompanyDate(week.start)} – ${formatCompanyDate(new Date(week.end.getTime() - 1))}`;
  const isCurrentWeek = week.start.getTime() === currentWeek.start.getTime();
  const previousWeek = currentCompanyWeek(new Date(week.start.getTime() - 1));
  const nextWeek = currentCompanyWeek(week.end);
  const previousHref = `/admin/employees/${employee.id}?week=${formatWeekParam(previousWeek.start)}`;
  const nextHref =
    nextWeek.start.getTime() === currentWeek.start.getTime()
      ? `/admin/employees/${employee.id}`
      : `/admin/employees/${employee.id}?week=${formatWeekParam(nextWeek.start)}`;

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Link href="/admin/employees" className="text-sm underline">
          Employees
        </Link>
        <EmployeeInfo
          name={`${employee.firstName} ${employee.lastName}`}
          email={employee.email}
          isActive={employee.isActive}
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold">
              {isCurrentWeek ? "This week" : "Past week"}
            </h1>
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
        <EmployeeShifts
          total={formatDuration(totalSeconds)}
          rows={shifts.map((shift) => ({
            id: shift.id,
            employeeName: `${employee.firstName} ${employee.lastName}`,
            clockIn: `${formatCompanyDate(shift.clockIn)}, ${formatCompanyTime(shift.clockIn)}`,
            clockOut: shift.clockOut
              ? `${formatCompanyDate(shift.clockOut)}, ${formatCompanyTime(shift.clockOut)}`
              : "Open",
            duration:
              shift.durationSeconds === null
                ? "—"
                : formatDuration(shift.durationSeconds),
            openShift: shift.clockOut
              ? null
              : { clockInLocal: formatCompanyDateTimeLocal(shift.clockIn) },
          }))}
        />
      </div>
    </section>
  );
}
