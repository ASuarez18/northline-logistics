"use client";

import { correctShift } from "@/app/admin/shifts/actions";
import { useRef, useState, type FormEvent } from "react";

export function EditShiftDialog({
  shiftId,
  employeeName,
  clockInLocal,
  clockOutLocal,
}: {
  shiftId: string;
  employeeName: string;
  clockInLocal: string;
  clockOutLocal: string;
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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setPending(true);
    const result = await correctShift(formData);
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
        Edit
      </button>
      <dialog
        ref={dialogRef}
        className="m-auto w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 text-left text-zinc-950 backdrop:bg-black/40 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
      >
        <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Edit {employeeName}</h2>
          <input type="hidden" name="shiftId" value={shiftId} />
          <label className="flex flex-col gap-1 text-sm">
            Clock in
            <input
              name="clockIn"
              type="datetime-local"
              required
              defaultValue={clockInLocal}
              className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Clock out
            <input
              name="clockOut"
              type="datetime-local"
              required
              defaultValue={clockOutLocal}
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
              {pending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
