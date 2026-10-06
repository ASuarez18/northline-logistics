import Link from "next/link";

type EmployeeRow = {
  id: string;
  name: string;
  total: string;
  isActive: boolean;
};

export function EmployeeTable({ rows }: { rows: EmployeeRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <tr>
            <th className="px-4 py-3 font-medium">Employee</th>
            <th className="px-4 py-3 font-medium">This week</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">
              <span className="sr-only">View</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-zinc-500" colSpan={4}>
                No employees yet.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-zinc-200 last:border-0 dark:border-zinc-800"
              >
                <td className="px-4 py-3">{row.name}</td>
                <td className="px-4 py-3">{row.total}</td>
                <td className="px-4 py-3">
                  {row.isActive ? "Active" : "Inactive"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/employees/${row.id}`}
                    className="underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
