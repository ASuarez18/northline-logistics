import { z } from "zod";

const timestamp = z.string().datetime({ offset: true });
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const shiftSchema = z.object({
  id: z.string(), clockIn: timestamp, clockOut: timestamp.nullable(),
});
export const statusSchema = z.object({
  employee: z.object({ firstName: z.string(), lastName: z.string() }),
  timeZone: z.string().refine((value) => {
    try { new Intl.DateTimeFormat("en", { timeZone: value }); return true; }
    catch { return false; }
  }),
  serverTime: timestamp,
  openShift: shiftSchema.nullable(),
  canClockIn: z.boolean(), canClockOut: z.boolean(),
  restriction: z.string().nullable(),
});
export const timesheetSchema = z.object({
  weekStart: date,
  totalSeconds: z.number().finite().nonnegative(),
  shifts: z.array(shiftSchema),
});
export type ClockState = z.infer<typeof statusSchema>;
export type Timesheet = z.infer<typeof timesheetSchema>;

export class DashboardError extends Error {
  constructor(message: string, public status = 0) { super(message); }
}
export async function request<T>(path: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/employee/${path}`, {
    ...init, credentials: "same-origin", cache: "no-store", redirect: "error",
  });
  if (!response.ok) {
    const message = response.status === 401 ? "Your session has expired. Please sign in again."
      : response.status === 403 ? "This dashboard is available to active employees only."
      : response.status === 409 ? "Your clock status changed. Refresh before trying again."
      : "We couldn’t update your dashboard. Please try again.";
    throw new DashboardError(message, response.status);
  }
  const result = schema.safeParse(await response.json().catch(() => null));
  if (!result.success) throw new DashboardError("Your dashboard is temporarily unavailable. Please try again.");
  return result.data;
}
export function duration(seconds: number) {
  const minutes = Math.floor(Math.max(0, seconds) / 60);
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;
}
export function formatTime(value: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone, hour: "numeric", minute: "2-digit" }).format(new Date(value));
}
export function formatDay(value: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone, weekday: "short", month: "short", day: "numeric" }).format(new Date(value));
}
export function moveWeek(week: string, direction: number) {
  const value = new Date(`${week}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + direction * 7);
  return value.toISOString().slice(0, 10);
}
