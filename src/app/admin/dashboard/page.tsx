import { ClockedInTable } from "@/components/admin/ClockedInTable";
import { findClockedInShifts } from "@/lib/db/queries/dashboard";
import { formatCompanyTime } from "@/lib/time/company-time";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const shifts = await findClockedInShifts();
  const rows = shifts.map((shift) => ({
    id: shift.id,
    name: `${shift.user.firstName} ${shift.user.lastName}`,
    clockedInAt: formatCompanyTime(shift.clockIn),
  }));

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Clocked in now</h2>
        <ClockedInTable rows={rows} />
      </div>
    </section>
  );
}
