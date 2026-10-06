import { Circle } from "lucide-react";

import { ClockOutDialog } from "@/components/admin/ClockOutDialog";

type ClockedInRow = {
  id: string;
  name: string;
  clockedInAt: string;
  clockInLocal: string;
};

export function ClockedInTable({ rows }: { rows: ClockedInRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-cream/50 px-4 py-8! text-center">
        <p className="font-medium text-text">Nobody is clocked in.</p>
        <p className="mt-1 text-sm text-muted">
          Active employee shifts will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="hidden border-b border-border bg-cream text-muted sm:table-header-group">
          <tr>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
              Employee
            </th>

            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
              Clocked in
            </th>

            <th className="px-4 py-3">
              <span className="sr-only">Clock out</span>
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
                <div className="flex items-center gap-2.5">
                  <Circle
                    size={8}
                    className="shrink-0 fill-success text-success"
                    aria-hidden="true"
                  />

                  <span className="font-semibold text-text">{row.name}</span>
                </div>
              </td>

              <td className="block px-4 py-1 sm:table-cell sm:py-3">
                <span className="text-xs text-muted sm:hidden">
                  Clocked in{" "}
                </span>

                <span className="font-medium text-text">
                  {row.clockedInAt}
                </span>
              </td>

              <td className="block px-4 pb-4 pt-2 sm:table-cell sm:py-3 sm:text-right">
                <ClockOutDialog
                  shiftId={row.id}
                  employeeName={row.name}
                  clockInLocal={row.clockInLocal}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}