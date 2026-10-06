import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { DeactivateDialog } from "@/components/admin/DeactivateDialog";

type EmployeeRow = {
  id: string;
  name: string;
  total: string;
  isActive: boolean;
};

export function EmployeeTable({ rows }: { rows: EmployeeRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-cream/50 px-4 py-8 text-center">
        <p className="font-medium text-text">No employees yet.</p>
        <p className="mt-1 text-sm text-muted">
          Add an employee to start building your team.
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
              This week
            </th>

            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
              Status
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
                <Link
                  href={`/admin/employees/${row.id}`}
                  className="font-semibold text-text transition hover:text-orange-dark"
                >
                  {row.name}
                </Link>
              </td>

              <td className="block px-4 py-1 sm:table-cell sm:py-3">
                <span className="text-xs text-muted sm:hidden">
                  This week{" "}
                </span>

                <span className="font-medium tabular-nums text-text">
                  {row.total}
                </span>
              </td>

              <td className="block px-4 py-1 sm:table-cell sm:py-3">
                <span
                  className={
                    row.isActive
                      ? "inline-flex items-center rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success"
                      : "inline-flex items-center rounded-full bg-sand px-2.5 py-1 text-xs font-semibold text-muted"
                  }
                >
                  {row.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              <td className="block px-4 pb-4 pt-3 sm:table-cell sm:py-3 sm:text-right">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:justify-end">
                  <DeactivateDialog
                    id={row.id}
                    name={row.name}
                    isActive={row.isActive}
                  />

                  <Link
                    href={`/admin/employees/${row.id}`}
                    className="inline-flex min-h-9 items-center gap-1 font-semibold text-orange-dark transition hover:text-orange"
                  >
                    View
                    <ChevronRight
                      size={15}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}