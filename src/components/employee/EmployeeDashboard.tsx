"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DashboardError, request, statusSchema, timesheetSchema, type ClockState, type Timesheet } from "@/lib/employee/dashboard";
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
        method: action ? "POST" : "GET", signal: abort.signal,
      });
      setStatus(updatedStatus);
      setNeedsLogin(false);
      if (action) setNotice(action === "clock-in" ? "You’re clocked in. Have a good shift!" : "You’re clocked out. Your shift has been saved.");
      // Always get the current week from the server's company calendar.
      const current = await request("timesheet", timesheetSchema, { signal: abort.signal });
      setCurrentWeek(current.weekStart);
      const week = selectedWeek.current;
      const nextSheet = week && week !== current.weekStart
        ? await request(`timesheet?weekStart=${encodeURIComponent(week)}`, timesheetSchema, { signal: abort.signal })
        : current;
      selectedWeek.current = nextSheet.weekStart;
      setSheet(nextSheet);
    } catch (cause) {
      // A failed POST may have reached the server: never retry a mutation automatically.
      setStatus(null);
      setSheet(null);
      setError(cause instanceof DashboardError ? cause.message : "We couldn’t reach your dashboard. Refresh to check your latest status.");
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

  return <main className="min-h-screen flex-1 bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-8">
        <Link href="/" className="font-semibold tracking-tight">ABC Holding <span className="font-normal text-slate-400">/ Employee portal</span></Link>
        <span className="text-sm text-slate-500">My dashboard</span>
      </div>
    </header>
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-2 text-sm font-medium text-emerald-700">YOUR WORKDAY, AT A GLANCE</p>
          <h1 className="text-3xl font-semibold tracking-tight">{status ? `Hello, ${status.employee.firstName}` : "My workday"}</h1>
          <p className="mt-2 text-slate-500">Manage your shift and keep track of your hours.</p></div>
        <button onClick={() => void refresh()} disabled={busy} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-50">{busy ? "Updating…" : "Refresh"}</button>
      </div>
      <div aria-live="polite" role="status">{notice && <p className="mb-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</p>}</div>
      {error && <div role="alert" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{error} {needsLogin && <Link href="/login" className="font-semibold underline">Sign in</Link>}</div>}
      <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
        <section aria-label="Time clock" aria-busy={busy} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <ClockStatus status={status} />
          <ClockControls status={status} busy={busy} onClock={(action) => void refresh(action)} />
        </section>
        <aside className="rounded-2xl bg-slate-900 p-6 text-white sm:p-8">
          <h2 className="text-lg font-semibold">A quick reminder</h2>
          <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
            <li>Clock in from 8:00 AM.</li>
            <li>Clock out by 5:00 PM. After that, ask your admin to close your shift.</li>
            <li>Taking a break? Clock out, then clock back in when you return.</li>
          </ul>
          {status && <p className="mt-6 border-t border-slate-700 pt-4 text-xs text-slate-400">All times in {status.timeZone}</p>}
        </aside>
      </div>
      <section aria-labelledby="timesheet-heading" aria-busy={busy} className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="timesheet-heading" className="text-xl font-semibold">My timesheet</h2>
          {sheet && <WeekSelector week={sheet.weekStart} currentWeek={currentWeek} busy={busy} onChange={(week) => { selectedWeek.current = week; void refresh(); }} />}
        </div>
        {sheet && status ? <TimeSheet timesheet={sheet} timeZone={status.timeZone} /> : <p className="py-12 text-center text-sm text-slate-500">{busy ? "Loading your shifts…" : "Your shifts are currently unavailable. Use Refresh to try again."}</p>}
      </section>
    </div>
  </main>;
}
