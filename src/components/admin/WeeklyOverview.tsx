import { Clock3 } from "lucide-react";

type WeekTotalRow = {
  id: string;
  name: string;
  total: string;
};

export function WeeklyOverview({ rows }: { rows: WeekTotalRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-cream/50 px-4 py-8 text-center">
        <Clock3
          size={22}
          strokeWidth={1.7}
          className="mx-auto text-muted"
          aria-hidden="true"
        />

        <p className="mt-3 font-medium text-text">No employees yet.</p>

        <p className="mt-1 text-sm text-muted">
          Employee weekly hours will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full table-fixed text-left text-sm">
        <thead className="border-b border-border bg-cream text-muted">
          <tr>
            <th className="w-2/3 px-3 py-3 text-xs font-semibold uppercase tracking-wide sm:px-4">
              Employee
            </th>

            <th className="w-1/3 px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide sm:px-4">
              Hours
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr
              key={row.id}
              className="bg-surface transition-colors hover:bg-cream/50"
            >
              <td className="truncate px-3 py-3.5 font-medium text-text sm:px-4">
                {row.name}
              </td>

              <td className="px-3 py-3.5 text-right sm:px-4">
                <span className="inline-flex rounded-md bg-orange-soft px-2.5 py-1 font-semibold tabular-nums text-orange-dark">
                  {row.total}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}