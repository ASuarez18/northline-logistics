import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { EmployeeApiError } from "../employee/errors";

// One company calendar, independent of the browser and server OS timezone.
import {
  COMPANY_TIME_ZONE,
  canEmployeeClockIn,
} from "../time/company-time";
export { COMPANY_TIME_ZONE };

export function companyDate(now: Date) {
  return formatInTimeZone(now, COMPANY_TIME_ZONE, "yyyy-MM-dd");
}

function shiftDate(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function weekRange(now: Date, requested?: string | null) {
  const today = companyDate(now);
  const day = new Date(`${today}T12:00:00Z`).getUTCDay();
  const current = shiftDate(today, -((day + 6) % 7));
  const weekStart = requested ?? current;
  const parsed = new Date(`${weekStart}T12:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(weekStart) ||
    !Number.isFinite(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== weekStart ||
    parsed.getUTCDay() !== 1
  ) {
    throw new EmployeeApiError(
      400,
      "INVALID_WEEK",
      "weekStart must be a valid Monday (YYYY-MM-DD).",
    );
  }
  return {
    weekStart,
    start: fromZonedTime(`${weekStart}T00:00:00`, COMPANY_TIME_ZONE),
    end: fromZonedTime(
      `${shiftDate(weekStart, 7)}T00:00:00`,
      COMPANY_TIME_ZONE,
    ),
  };
}

export function clockPermissions(
  now: Date,
  openShift: { clockIn: Date } | null,
) {
  if (openShift) {
  const canClockOut = now >= openShift.clockIn;

  return {
    canClockIn: false,
    canClockOut,
    restriction: canClockOut
      ? null
      : "Clock-out must be after clock-in.",
  };
}
  const canClockIn = canEmployeeClockIn(now);
  return {
    canClockIn,
    canClockOut: false,
    restriction: canClockIn
      ? null
      : "You can clock in starting at 8:00 AM.",
  };
}
