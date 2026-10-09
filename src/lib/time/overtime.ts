import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import {
  BUSINESS_END_HOUR,
  COMPANY_TIME_ZONE,
} from "./company-time";

export function calculateOvertimeSeconds(
  clockIn: Date,
  clockOut: Date,
): number {
  if (clockOut <= clockIn) return 0;

  let overtimeMilliseconds = 0;
  let currentDay = formatInTimeZone(
    clockIn,
    COMPANY_TIME_ZONE,
    "yyyy-MM-dd",
  );

  const lastDay = formatInTimeZone(
    clockOut,
    COMPANY_TIME_ZONE,
    "yyyy-MM-dd",
  );

  while (currentDay <= lastDay) {
    const endHour = String(BUSINESS_END_HOUR).padStart(2, "0");

    const overtimeStart = fromZonedTime(
      `${currentDay}T${endHour}:00:00`,
      COMPANY_TIME_ZONE,
    );

    const nextDay = new Date(`${currentDay}T12:00:00Z`);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);

    const nextDayString = nextDay.toISOString().slice(0, 10);

    const dayEnd = fromZonedTime(
      `${nextDayString}T00:00:00`,
      COMPANY_TIME_ZONE,
    );

    const overlapStart = Math.max(
      clockIn.getTime(),
      overtimeStart.getTime(),
    );

    const overlapEnd = Math.min(
      clockOut.getTime(),
      dayEnd.getTime(),
    );

    overtimeMilliseconds += Math.max(0, overlapEnd - overlapStart);

    currentDay = nextDayString;
  }

  return overtimeMilliseconds / 1000;
}