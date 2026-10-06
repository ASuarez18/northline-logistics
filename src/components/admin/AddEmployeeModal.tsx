"use client";

import { createEmployee } from "@/app/admin/employees/actions";
import { useRef, useState } from "react";
import { Plus, UserPlus, X } from "lucide-react";

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
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
      >
        <Plus size={17} strokeWidth={2} aria-hidden="true" />
        Add employee
      </button>

      <dialog
        ref={dialogRef}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-border bg-surface p-0 text-text shadow-xl backdrop:bg-ink/50"
      >
        <form action={onSubmit} ref={formRef}>
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
            <div className="flex gap-3 items-center">
              <div className="grid size-14 shrink-0 place-items-center rounded-lg bg-orange-soft text-orange-dark">
                <UserPlus size={32} strokeWidth={1.8} aria-hidden="true" />
              </div>

              <div>
                <h2 className="font-heading text-lg font-bold text-ink">
                  Add employee
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Create login access for a new employee.
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

          <div className="grid gap-4 px-5 py-5 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-medium text-text">
                First name
                <input
                  name="firstName"
                  required
                  autoComplete="given-name"
                  className="min-h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none transition placeholder:text-muted focus:border-orange focus:ring-2 focus:ring-orange-soft"
                />
              </label>

              <label className="grid gap-1.5 text-sm font-medium text-text">
                Last name
                <input
                  name="lastName"
                  required
                  autoComplete="family-name"
                  className="min-h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none transition placeholder:text-muted focus:border-orange focus:ring-2 focus:ring-orange-soft"
                />
              </label>
            </div>

            <label className="grid gap-1.5 text-sm font-medium text-text">
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="min-h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none transition placeholder:text-muted focus:border-orange focus:ring-2 focus:ring-orange-soft"
              />
            </label>

            <label className="grid gap-1.5 text-sm font-medium text-text">
              Password
              <input
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="min-h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none transition placeholder:text-muted focus:border-orange focus:ring-2 focus:ring-orange-soft"
              />
              <span className="text-xs font-normal text-muted">
                Use at least 8 characters.
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
              {pending ? "Saving..." : "Save employee"}
            </button>
          </div>
        </form>
      </dialog>
    </>
);
}
