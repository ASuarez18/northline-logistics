import { EmployeeTable } from "@/components/admin/EmployeeTable";
import { findWeekTotals } from "@/lib/db/queries/dashboard";
import {
  currentCompanyWeek,
  formatDuration,
} from "@/lib/time/company-time";

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
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Employees</h1>
      <EmployeeTable rows={rows} />
    </section>
  );
}
