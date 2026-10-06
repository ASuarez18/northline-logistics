"use client";

import { closeShift } from "@/app/admin/shifts/actions";
import { useRef, useState } from "react";

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
      <button type="button" onClick={openDialog} className="underline">
        Clock out
      </button>
      <dialog
        ref={dialogRef}
        className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 text-left text-zinc-950 backdrop:bg-black/40 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
      >
        <form ref={formRef} action={onSubmit} className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Clock out {employeeName}</h2>
          <input type="hidden" name="shiftId" value={shiftId} />
          <label className="flex flex-col gap-1 text-sm">
            Clock out
            <input
              name="clockOut"
              type="datetime-local"
              required
              min={clockInLocal}
              className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Reason
            <input
              name="reason"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-md px-3 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-950"
            >
              {pending ? "Saving..." : "Clock out"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
