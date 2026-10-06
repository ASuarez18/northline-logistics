"use client";

import { closeShift } from "@/app/admin/shifts/actions";
import { useRef, useState } from "react";

import { ClockArrowDown, X } from "lucide-react";

export function ClockOutDialog({
  shiftId,
  employeeName,
  clockInLocal,
}: {
  shiftId: string;
  employeeName: string;
  clockInLocal: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function openDialog() {
    setError(null);
    formRef.current?.reset();
    dialogRef.current?.showModal();
  }

  async function onSubmit(formData: FormData) {
    setPending(true);
    const result = await closeShift(formData);
    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    formRef.current?.reset();
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="inline-flex min-h-9 items-center gap-1.5 font-semibold text-orange-dark transition hover:text-orange"
      >
        <ClockArrowDown size={15} strokeWidth={1.8} aria-hidden="true" />
        Clock out
      </button>

      <dialog
        ref={dialogRef}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-border bg-surface p-0 text-left text-text shadow-xl backdrop:bg-ink/50"
      >
        <form ref={formRef} action={onSubmit}>
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="grid size-14 shrink-0 place-items-center rounded-lg bg-warning-soft text-warning">
                <ClockArrowDown
                  size={30}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2 className="font-heading text-lg font-bold text-ink">
                  Clock out employee
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Close {employeeName}&apos;s open shift.
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

          <input type="hidden" name="shiftId" value={shiftId} />

          <div className="grid gap-4 px-5 py-5 sm:px-6">
            <div className="rounded-md border border-warning/20 bg-warning-soft px-3 py-2.5 text-sm text-warning">
              This shift is currently open. Closing it manually will be recorded
              as an administrative change.
            </div>

            <label className="grid gap-1.5 text-sm font-medium text-text">
              Clock out
              <input
                name="clockOut"
                type="datetime-local"
                required
                min={clockInLocal}
                className="min-h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none transition focus:border-orange focus:ring-2 focus:ring-orange-soft"
              />
            </label>

            <label className="grid gap-1.5 text-sm font-medium text-text">
              Reason
              <input
                name="reason"
                required
                placeholder="Why is this shift being closed manually?"
                className="min-h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none transition placeholder:text-muted focus:border-orange focus:ring-2 focus:ring-orange-soft"
              />
              <span className="text-xs font-normal text-muted">
                This reason will be recorded with the change.
              </span>
            </label>

            {error ? (
              <div
                role="alert"
                className="rounded-md border border-danger/20 bg-danger-soft px-3 py-2.5 text-sm text-danger"
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
              type="submit"
              disabled={pending}
              className="min-h-10 rounded-md bg-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Saving..." : "Clock out employee"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
