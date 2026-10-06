import { Mail, UserRound } from "lucide-react";

export function EmployeeInfo({
  name,
  email,
  isActive,
}: {
  name: string;
  email: string;
  isActive: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-orange-soft text-orange-dark">
            <UserRound size={30} strokeWidth={1.7} aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate font-heading text-xl font-bold text-ink sm:text-2xl">
              {name}
            </h1>

            <div className="mt-1.5 flex min-w-0 items-center gap-2 text-sm text-muted">
              <Mail
                size={15}
                strokeWidth={1.8}
                className="shrink-0"
                aria-hidden="true"
              />

              <span className="truncate">{email}</span>
            </div>
          </div>
        </div>

        <span
          className={
            isActive
              ? "inline-flex w-fit items-center rounded-full bg-success-soft px-3 py-1.5 text-xs font-semibold text-success"
              : "inline-flex w-fit items-center rounded-full bg-sand px-3 py-1.5 text-xs font-semibold text-muted"
          }
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
}
