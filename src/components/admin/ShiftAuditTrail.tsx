import { History, UserRound } from "lucide-react";

type ShiftAuditRow = {
  id: string;
  previousClockIn: string | null;
  previousClockOut: string | null;
  newClockIn: string | null;
  newClockOut: string | null;
  reason: string;
  createdAt: string;
  changedBy: string;
};

export function ShiftAuditTrail({ rows }: { rows: ShiftAuditRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-cream/50 px-4 py-8 text-center">
        <History
          size={22}
          strokeWidth={1.7}
          className="mx-auto text-muted"
          aria-hidden="true"
        />

        <p className="mt-3 font-medium text-text">No administrative changes</p>

        <p className="mt-1 text-sm text-muted">
          Corrections and manually closed shifts will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
      {rows.map((audit) => (
        <article key={audit.id} className="bg-surface p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <div className="grid size-8 shrink-0 place-items-center rounded-full bg-orange-soft text-orange-dark">
                <UserRound size={16} strokeWidth={1.8} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text">
                  {audit.changedBy}
                </p>

                <p className="text-xs text-muted">Administrative change</p>
              </div>
            </div>

            <time className="text-xs text-muted">{audit.createdAt}</time>
          </div>

          <div className="mt-4 rounded-md bg-cream px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Reason
            </p>

            <p className="mt-1 text-sm text-text">{audit.reason}</p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-border p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Previous
              </p>

              <dl className="mt-2 grid gap-1.5 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-muted">Clock in</dt>
                  <dd className="text-right font-medium text-text">
                    {audit.previousClockIn ?? "—"}
                  </dd>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <dt className="text-muted">Clock out</dt>
                  <dd className="text-right font-medium text-text">
                    {audit.previousClockOut ?? "Open"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-md border border-success/20 bg-success-soft/50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-success">
                Updated
              </p>

              <dl className="mt-2 grid gap-1.5 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-muted">Clock in</dt>
                  <dd className="text-right font-medium text-text">
                    {audit.newClockIn ?? "—"}
                  </dd>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <dt className="text-muted">Clock out</dt>
                  <dd className="text-right font-medium text-text">
                    {audit.newClockOut ?? "Open"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
