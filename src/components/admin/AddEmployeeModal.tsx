"use client";

import { createEmployee } from "@/app/admin/employees/actions";
import { useRef, useState } from "react";

export function AddEmployeeModal() {
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
    const result = await createEmployee(formData);
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
        className="rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-950"
      >
        Add employee
      </button>
      <dialog
        ref={dialogRef}
        className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 text-zinc-950 backdrop:bg-black/40 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
      >
        <form action={onSubmit} ref={formRef} className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Add employee</h2>
          <label className="flex flex-col gap-1 text-sm">
            First name
            <input
              name="firstName"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Last name
            <input
              name="lastName"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Email
            <input
              name="email"
              type="email"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Password
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
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
