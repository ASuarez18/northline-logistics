"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  DashboardError,
  request,
  statusSchema,
  timesheetSchema,
  type ClockState,
  type Timesheet,
} from "@/lib/employee/dashboard";
import ClockStatus from "./ClockStatus";
import ClockControls from "./ClockControls";
import WeekSelector from "./WeekSelector";
import TimeSheet from "./TimeSheet";

export default function EmployeeDashboard() {
  const [status, setStatus] = useState<ClockState | null>(null);
  const [sheet, setSheet] = useState<Timesheet | null>(null);
  const [currentWeek, setCurrentWeek] = useState("");
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);
  const [notice, setNotice] = useState("");
  const selectedWeek = useRef("");
  const locked = useRef(false);
  const controller = useRef<AbortController | null>(null);

  const refresh = useCallback(async (action?: "clock-in" | "clock-out") => {
    if (locked.current) return;
    locked.current = true;
    const abort = new AbortController();
    controller.current = abort;
    const timeout = window.setTimeout(() => abort.abort(), 15000);
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const updatedStatus = await request(action ?? "status", statusSchema, {
        method: action ? "POST" : "GET",
        signal: abort.signal,
      });
      setStatus(updatedStatus);
      setNeedsLogin(false);
      if (action)
        setNotice(
          action === "clock-in"
            ? "You’re clocked in. Have a good shift!"
            : "You’re clocked out. Your shift has been saved.",
        );
      // Always get the current week from the server's company calendar.
      const current = await request("timesheet", timesheetSchema, {
        signal: abort.signal,
      });
      setCurrentWeek(current.weekStart);
      const week = selectedWeek.current;
      const nextSheet =
        week && week !== current.weekStart
          ? await request(
              `timesheet?weekStart=${encodeURIComponent(week)}`,
              timesheetSchema,
              { signal: abort.signal },
            )
          : current;
      selectedWeek.current = nextSheet.weekStart;
      setSheet(nextSheet);
    } catch (cause) {
      // A failed POST may have reached the server: never retry a mutation automatically.
      setStatus(null);
      setSheet(null);
      setError(
        cause instanceof DashboardError
          ? cause.message
          : "We couldn’t reach your dashboard. Refresh to check your latest status.",
      );
      setNeedsLogin(cause instanceof DashboardError && cause.status === 401);
    } finally {
      window.clearTimeout(timeout);
      locked.current = false;
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => void refresh(), 0);
    const poll = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, 60000);
    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(poll);
      window.removeEventListener("focus", onFocus);
      controller.current?.abort();
    };
  }, [refresh]);

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[1.8px] text-orange">
              Your workday, at a glance
            </p>

            <h1 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {status ? `Hello, ${status.employee.firstName}` : "My workday"}
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
              Manage your shift and keep track of your hours.
            </p>
          </div>

          <button
            onClick={() => void refresh()}
            disabled={busy}
            className="min-h-10 self-start rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            {busy ? "Updating…" : "Refresh"}
          </button>
        </div>
        <div aria-live="polite" role="status">
          {notice && (
            <p className="mb-5 rounded-xl border border-success/20 bg-success-soft px-4 py-3 text-sm text-success">
              {notice}
            </p>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-warning/20 bg-warning-soft px-4 py-3 text-sm text-warning"
          >
            {error}{" "}
            {needsLogin && (
              <Link
                href="/login"
                className="font-bold underline underline-offset-2"
              >
                Sign in
              </Link>
            )}
          </div>
        )}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,1fr)] lg:gap-6">
          <section
            aria-label="Time clock"
            aria-busy={busy}
            className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7 lg:p-8"
          >
            <ClockStatus status={status} />
            <ClockControls
              status={status}
              busy={busy}
              onClock={(action) => void refresh(action)}
            />
          </section>

          <aside className="rounded-2xl bg-ink p-5 text-white sm:p-7 lg:p-8">
            <p className="text-xs font-bold uppercase tracking-[1.8px] text-orange">
              Before you clock
            </p>

            <h2 className="mt-2 font-heading text-xl font-bold">
              A quick reminder
            </h2>

            <ul className="mt-5 space-y-4 text-sm leading-6 text-white/70">
              <li>Clock in from 8:00 AM.</li>
              <li>
                Clock out by 5:00 PM. After that, ask your admin to close your
                shift.
              </li>
              <li>
                Taking a break? Clock out, then clock back in when you return.
              </li>
            </ul>

            {status && (
              <p className="mt-6 border-t border-white/15 pt-4 text-xs text-white/50">
                All times in {status.timeZone}
              </p>
            )}
          </aside>
        </div>
        <section
          aria-labelledby="timesheet-heading"
          aria-busy={busy}
          className="mt-5 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:mt-6 sm:p-7 lg:p-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2
              id="timesheet-heading"
              className="font-heading text-xl font-bold text-ink"
            >
              My timesheet
            </h2>

            {sheet && (
              <WeekSelector
                week={sheet.weekStart}
                currentWeek={currentWeek}
                busy={busy}
                onChange={(week) => {
                  selectedWeek.current = week;
                  void refresh();
                }}
              />
            )}
          </div>

          {sheet && status ? (
            <TimeSheet timesheet={sheet} timeZone={status.timeZone} />
          ) : (
            <p className="py-12 text-center text-sm text-muted">
              {busy
                ? "Loading your shifts…"
                : "Your shifts are currently unavailable. Use Refresh to try again."}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
