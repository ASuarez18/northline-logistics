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

export function currentCompanyWeek(now = new Date()) {
  const zonedNow = toZonedTime(now, COMPANY_TIME_ZONE);
  const weekStart = startOfWeek(zonedNow, { weekStartsOn: 1 });
  const weekEnd = addWeeks(weekStart, 1);

  return {
    start: fromZonedTime(weekStart, COMPANY_TIME_ZONE),
    end: fromZonedTime(weekEnd, COMPANY_TIME_ZONE),
  };
}
