"use client";

import { setEmployeeActive } from "@/app/admin/employees/actions";
import { useRef, useState } from "react";
import { UserCheck, UserX, X } from "lucide-react";

export function DeactivateDialog({
  id,
  name,
  isActive,
}: {
  id: string;
  name: string;
  isActive: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onConfirm() {
    setPending(true);
    const result = await setEmployeeActive(id, !isActive);
    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          dialogRef.current?.showModal();
        }}
        className={
          isActive
            ? "min-h-9 font-semibold text-danger transition hover:underline"
            : "min-h-9 font-semibold text-success transition hover:underline"
        }
      >
        {isActive ? "Deactivate" : "Activate"}
      </button>

      <dialog
        ref={dialogRef}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-border bg-surface p-0 text-left text-text shadow-xl backdrop:bg-ink/50"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="flex gap-3 items-center">
            <div
              className={
                isActive
                  ? "grid size-14 shrink-0 place-items-center rounded-lg bg-danger-soft text-danger"
                  : "grid size-14 shrink-0 place-items-center rounded-lg bg-success-soft text-success"
              }
            >
              {isActive ? (
                <UserX size={32} strokeWidth={1.8} aria-hidden="true" />
              ) : (
                <UserCheck size={32} strokeWidth={1.8} aria-hidden="true" />
              )}
            </div>

            <div>
              <h2 className="font-heading text-lg font-bold text-ink">
                {isActive ? "Deactivate employee" : "Activate employee"}
              </h2>

              <p className="mt-1 text-sm text-muted">
                {isActive
                  ? "This will revoke the employee's account access."
                  : "This will restore the employee's account access."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close dialog"
            className="grid size-9 shrink-0 place-items-center rounded-md text-muted transition hover:bg-cream hover:text-ink"
          >
            <X size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        <div className="px-5 py-5 sm:px-6">
          <p className="text-sm leading-6 text-text">
            {isActive ? (
              <>
                <span className="font-semibold">{name}</span> will no longer be
                able to log in. Their existing shift history will remain in the
                system.
              </>
            ) : (
              <>
                <span className="font-semibold">{name}</span> will be able to
                log in again.
              </>
            )}
          </p>

          {error ? (
            <div
              role="alert"
              className="mt-4 rounded-md border border-danger/20 bg-danger-soft px-3 py-2.5 text-sm text-danger"
            >
              {error}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-border bg-cream/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="min-h-10 rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-text transition hover:bg-cream"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={
              isActive
                ? "min-h-10 rounded-md bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                : "min-h-10 rounded-md bg-success px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            }
          >
            {pending
              ? "Saving..."
              : isActive
                ? "Deactivate employee"
                : "Activate employee"}
          </button>
        </div>
      </dialog>
    </>
  );
}
