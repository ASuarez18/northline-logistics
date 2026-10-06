import { AddEmployeeModal } from "@/components/admin/AddEmployeeModal";
import { EmployeeTable } from "@/components/admin/EmployeeTable";
import { findWeekTotals } from "@/lib/db/queries/dashboard";
import { currentCompanyWeek, formatDuration } from "@/lib/time/company-time";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const week = currentCompanyWeek();
  const employees = await findWeekTotals(week.start, week.end);
  const rows = employees.map((employee) => ({
    id: employee.id,
    name: `${employee.firstName} ${employee.lastName}`,
    total: formatDuration(employee.totalSeconds),
    isActive: employee.isActive,
  }));

  return (
    <>
      <header className="mb-6 sm:mb-7">
        <p className="text-xs font-bold uppercase tracking-[1.7px] text-orange-dark">
          Administration
        </p>

        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-[31px]">
              Employees
            </h1>

            <p className="mt-1 text-sm text-muted">
              Manage employee access and review weekly working hours.
            </p>
          </div>

          <div className="shrink-0">
            <AddEmployeeModal />
          </div>
        </div>
      </header>

      <section className="rounded-xl border border-border bg-surface p-4 sm:p-6">
        <div className="mb-4">
          <h2 className="font-heading text-lg font-bold text-ink">
            Employee directory
          </h2>

          <p className="mt-1 text-sm text-muted">
            Current employees and their hours for this week.
          </p>
        </div>

        <EmployeeTable rows={rows} />
      </section>
    </>
  );
}
