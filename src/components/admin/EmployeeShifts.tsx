import { Clock3 } from "lucide-react";

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
  if (rows.length === 0) {
    return (
      <div>
        <div className="rounded-lg border border-dashed border-border bg-cream/50 px-4 py-8 text-center">
          <Clock3
            size={22}
            strokeWidth={1.7}
            className="mx-auto text-muted"
            aria-hidden="true"
          />

          <p className="mt-3 font-medium text-text">No shifts this week.</p>

          <p className="mt-1 text-sm text-muted">
            Recorded employee shifts will appear here.
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-cream px-4 py-3">
          <span className="text-sm font-semibold text-text">Weekly total</span>

          <span className="rounded-md bg-orange-soft px-2.5 py-1 text-sm font-semibold tabular-nums text-orange-dark">
            {total}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="hidden border-b border-border bg-cream text-muted sm:table-header-group">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Clock in
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Clock out
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Duration
              </th>

              <th className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr
                key={row.id}
                className="block bg-surface sm:table-row sm:transition-colors sm:hover:bg-cream/50"
              >
                <td className="block px-4 pb-1 pt-4 sm:table-cell sm:py-3">
                  <span className="mr-2 text-xs font-medium text-muted sm:hidden">
                    Clock in
                  </span>

                  <span className="font-medium text-text">{row.clockIn}</span>
                </td>

                <td className="block px-4 py-1 sm:table-cell sm:py-3">
                  <span className="mr-2 text-xs font-medium text-muted sm:hidden">
                    Clock out
                  </span>

                  {row.openShift ? (
                    <span className="inline-flex rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning">
                      Open
                    </span>
                  ) : (
                    <span className="text-text">{row.clockOut}</span>
                  )}
                </td>

                <td className="block px-4 py-1 sm:table-cell sm:py-3">
                  <span className="mr-2 text-xs font-medium text-muted sm:hidden">
                    Duration
                  </span>

                  <span className="font-semibold tabular-nums text-text">
                    {row.duration}
                  </span>
                </td>

                <td className="block px-4 pb-4 pt-3 sm:table-cell sm:py-3 sm:text-right">
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
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-cream px-4 py-3">
        <span className="text-sm font-semibold text-text">Weekly total</span>

        <span className="rounded-md bg-orange-soft px-2.5 py-1 text-sm font-semibold tabular-nums text-orange-dark">
          {total}
        </span>
      </div>
    </div>
  );
}
