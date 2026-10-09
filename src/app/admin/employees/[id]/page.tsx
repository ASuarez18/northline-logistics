import { EmployeeInfo } from "@/components/admin/EmployeeInfo";
import { EmployeeShifts } from "@/components/admin/EmployeeShifts";
import {
  findEmployee,
  findEmployeeShifts,
  findEmployeeShiftAudits,
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
import { calculateOvertimeSeconds } from "@/lib/time/overtime";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock3,
  History,
} from "lucide-react";
import { ShiftAuditTrail } from "@/components/admin/ShiftAuditTrail";

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
  const [shifts, totalSeconds, shiftAudits] = await Promise.all([
    findEmployeeShifts(employee.id, week.start, week.end),
    findEmployeeWeekTotal(employee.id, week.start, week.end),
    findEmployeeShiftAudits(employee.id, week.start, week.end),
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
    <section className="flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-col gap-4">
        <Link
          href="/admin/employees"
          className="inline-flex w-fit min-h-9 items-center gap-1.5 text-sm font-semibold text-orange-dark transition hover:text-orange"
        >
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          Back to employees
        </Link>

        <EmployeeInfo
          name={`${employee.firstName} ${employee.lastName}`}
          email={employee.email}
          isActive={employee.isActive}
        />
      </div>
      <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Clock3
                size={18}
                strokeWidth={1.8}
                className="text-orange-dark"
                aria-hidden="true"
              />

              <h2 className="font-heading text-lg font-bold text-ink">
                {isCurrentWeek ? "This week" : "Past week"}
              </h2>
            </div>

            <p className="mt-1.5 text-sm text-muted">{weekLabel}</p>
          </div>

          <nav
            aria-label="Employee timesheet week navigation"
            className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
          >
            <Link
              href={previousHref}
              className="inline-flex min-h-9 items-center gap-1 font-semibold text-orange-dark transition hover:text-orange"
            >
              <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
              Previous
            </Link>

            {isCurrentWeek ? (
              <span
                aria-disabled="true"
                className="inline-flex min-h-9 items-center gap-1 font-semibold text-muted"
              >
                Next
                <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
              </span>
            ) : (
              <Link
                href={nextHref}
                className="inline-flex min-h-9 items-center gap-1 font-semibold text-orange-dark transition hover:text-orange"
              >
                Next
                <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
            )}
          </nav>
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
                : formatDuration(
                    Math.max(
                      0,
                      shift.durationSeconds -
                        calculateOvertimeSeconds(
                          shift.clockIn,
                          shift.clockOut!,
                        ),
                    ),
                  ),
            overtime: shift.clockOut
              ? calculateOvertimeSeconds(shift.clockIn, shift.clockOut)
              : 0,
            openShift: shift.clockOut
              ? null
              : { clockInLocal: formatCompanyDateTimeLocal(shift.clockIn) },
            closedShift: shift.clockOut
              ? {
                  clockInLocal: formatCompanyDateTimeLocal(shift.clockIn),
                  clockOutLocal: formatCompanyDateTimeLocal(shift.clockOut),
                }
              : null,
          }))}
        />
      </div>
      <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <History
              size={18}
              strokeWidth={1.8}
              className="text-orange-dark"
              aria-hidden="true"
            />

            <h2 className="font-heading text-lg font-bold text-ink">
              Administrative history
            </h2>
          </div>

          <p className="mt-1.5 text-sm text-muted">
            Corrections and manually closed shifts for this week.
          </p>
        </div>

        <ShiftAuditTrail
          rows={shiftAudits.map((audit) => ({
            id: audit.id,
            previousClockIn: audit.previousClockIn
              ? `${formatCompanyDate(audit.previousClockIn)}, ${formatCompanyTime(audit.previousClockIn)}`
              : null,
            previousClockOut: audit.previousClockOut
              ? `${formatCompanyDate(audit.previousClockOut)}, ${formatCompanyTime(audit.previousClockOut)}`
              : null,
            newClockIn: audit.newClockIn
              ? `${formatCompanyDate(audit.newClockIn)}, ${formatCompanyTime(audit.newClockIn)}`
              : null,
            newClockOut: audit.newClockOut
              ? `${formatCompanyDate(audit.newClockOut)}, ${formatCompanyTime(audit.newClockOut)}`
              : null,
            reason: audit.reason,
            createdAt: `${formatCompanyDate(audit.createdAt)}, ${formatCompanyTime(audit.createdAt)}`,
            changedBy: `${audit.changedBy.firstName} ${audit.changedBy.lastName}`,
          }))}
        />
      </div>
    </section>
  );
}
