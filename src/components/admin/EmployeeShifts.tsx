import { ClockOutDialog } from "@/components/admin/ClockOutDialog";
import { EditShiftDialog } from "@/components/admin/EditShiftDialog";

type ShiftRow = {
  id: string;
  clockIn: string;
  clockOut: string;
  duration: string;
  openShift: { clockInLocal: string } | null;
  closedShift: { clockInLocal: string; clockOutLocal: string } | null;
  employeeName: string;
};

export function EmployeeShifts({
  rows,
  total,
}: {
  rows: ShiftRow[];
  total: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <tr>
            <th className="px-4 py-3 font-medium">Clock in</th>
            <th className="px-4 py-3 font-medium">Clock out</th>
            <th className="px-4 py-3 font-medium">Duration</th>
            <th className="px-4 py-3 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-zinc-500" colSpan={4}>
                No shifts this week.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-zinc-200 last:border-0 dark:border-zinc-800"
              >
                <td className="px-4 py-3">{row.clockIn}</td>
                <td className="px-4 py-3">{row.clockOut}</td>
                <td className="px-4 py-3">{row.duration}</td>
                <td className="px-4 py-3 text-right">
                  {row.openShift ? (
                    <ClockOutDialog
                      shiftId={row.id}
                      employeeName={row.employeeName}
                      clockInLocal={row.openShift.clockInLocal}
                    />
                  ) : row.closedShift ? (
                    <EditShiftDialog
                      shiftId={row.id}
                      employeeName={row.employeeName}
                      clockInLocal={row.closedShift.clockInLocal}
                      clockOutLocal={row.closedShift.clockOutLocal}
                    />
                  ) : null}
                </td>
              </tr>
            ))
          )}
          <tr className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <td className="px-4 py-3 font-medium" colSpan={2}>
              Total
            </td>
            <td className="px-4 py-3 font-medium">{total}</td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
