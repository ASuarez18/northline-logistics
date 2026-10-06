import { formatInTimeZone } from "date-fns-tz";

export const COMPANY_TIME_ZONE = "America/Vancouver";

export function formatCompanyTime(date: Date) {
  return formatInTimeZone(date, COMPANY_TIME_ZONE, "h:mm a");
}
