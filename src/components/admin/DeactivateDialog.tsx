"use client";

import { setEmployeeActive } from "@/app/admin/employees/actions";
import { useRef, useState } from "react";

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
        className="underline"
      >
        {isActive ? "Deactivate" : "Activate"}
      </button>
      <dialog
        ref={dialogRef}
        className="m-auto w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 text-zinc-950 backdrop:bg-black/40 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
      >
        <h2 className="text-lg font-semibold">
          {isActive ? "Deactivate employee" : "Activate employee"}
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {isActive
            ? `${name} will not be able to log in. Their shifts stay in the system.`
            : `${name} will be able to log in again.`}
        </p>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded-md px-3 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-950"
          >
            {pending ? "Saving..." : isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </dialog>
    </>
  );
}
