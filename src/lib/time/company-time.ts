import { addWeeks, startOfWeek } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

export const COMPANY_TIME_ZONE = "America/Vancouver";

export function formatCompanyTime(date: Date) {
  return formatInTimeZone(date, COMPANY_TIME_ZONE, "h:mm a");
}

export function formatCompanyDate(date: Date) {
  return formatInTimeZone(date, COMPANY_TIME_ZONE, "MMM d");
}

export function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}

export function formatCompanyDateTimeLocal(date: Date) {
  return formatInTimeZone(date, COMPANY_TIME_ZONE, "yyyy-MM-dd'T'HH:mm");
}

export function parseCompanyDateTime(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return null;
  }

  const parsed = fromZonedTime(value.replace("T", " "), COMPANY_TIME_ZONE);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatWeekParam(weekStart: Date) {
  return formatInTimeZone(weekStart, COMPANY_TIME_ZONE, "yyyy-MM-dd");
}

export function currentCompanyWeek(now = new Date()) {
  const zonedNow = toZonedTime(now, COMPANY_TIME_ZONE);
  const weekStart = startOfWeek(zonedNow, { weekStartsOn: 1 });
  const weekEnd = addWeeks(weekStart, 1);

  return {
    start: fromZonedTime(weekStart, COMPANY_TIME_ZONE),
    end: fromZonedTime(weekEnd, COMPANY_TIME_ZONE),
  };
}

export function companyWeekFromParam(value: string | undefined, now = new Date()) {
  const current = currentCompanyWeek(now);
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return current;
  }

  const selected = currentCompanyWeek(
    fromZonedTime(`${value} 00:00:00`, COMPANY_TIME_ZONE),
  );
  if (Number.isNaN(selected.start.getTime()) || selected.start > current.start) {
    return current;
  }

  return selected;
}
