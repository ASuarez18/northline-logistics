import type { Prisma, PrismaClient } from "../generated/prisma/client";
import { EmployeeApiError } from "../employee/errors";
import { findOpenShift, readWeeklyShifts } from "../db/queries/shifts";
import { clockPermissions, COMPANY_TIME_ZONE, weekRange } from "../employee/clock-rules";

type Operation = "status" | "timesheet" | "clock-in" | "clock-out";
type Employee = { id: string; firstName: string; lastName: string; role: string; isActive: boolean };

async function requireEmployee(tx: Prisma.TransactionClient, userId: string) {
  // Serializes employee mutations (including concurrent requests from two tabs).
  // Checking the role after the lock also prevents racing employee deactivation.
  const [employee] = await tx.$queryRaw<Employee[]>`
    SELECT "id", "firstName", "lastName", "role", "isActive"
    FROM "User" WHERE "id" = ${userId} FOR UPDATE
  `;
  if (!employee || employee.role !== "EMPLOYEE" || !employee.isActive) {
    throw new EmployeeApiError(403, "EMPLOYEE_REQUIRED", "An active employee account is required.");
  }
  return employee;
}

export async function executeEmployeeOperation(
  db: PrismaClient, userId: string, operation: Operation, requestedWeek?: string | null,
  now: () => Date = () => new Date(),
) {
  return db.$transaction(async (tx) => {
    const employee = await requireEmployee(tx, userId);
    // Obtain time after acquiring the lock, so waiting requests cannot use stale time.
    const currentTime = now();
    if (operation === "timesheet") {
      const range = weekRange(currentTime, requestedWeek);
      return { weekStart: range.weekStart, ...await readWeeklyShifts(tx, userId, range.start, range.end) };
    }
    let openShift = await findOpenShift(tx, userId);
    const permissions = clockPermissions(currentTime, openShift);
    if (operation === "clock-in") {
      if (openShift) throw new EmployeeApiError(409, "ALREADY_CLOCKED_IN", "You are already clocked in.");
      if (!permissions.canClockIn) throw new EmployeeApiError(422, "CLOCK_IN_TOO_EARLY", permissions.restriction!);
      openShift = await tx.shift.create({
        data: { userId, clockIn: currentTime },
        select: { id: true, clockIn: true, clockOut: true },
      });
    } else if (operation === "clock-out") {
      if (!openShift) throw new EmployeeApiError(409, "NO_OPEN_SHIFT", "There is no open shift to close.");
      if (currentTime <= openShift.clockIn) {
        throw new EmployeeApiError(422, "CLOCK_OUT_NOT_ALLOWED", "Clock-out must be after clock-in.");
      }
      if (!permissions.canClockOut) throw new EmployeeApiError(422, "CLOCK_OUT_NOT_ALLOWED", permissions.restriction!);
      const result = await tx.shift.updateMany({
        where: { id: openShift.id, userId, clockOut: null, clockIn: openShift.clockIn },
        data: { clockOut: currentTime },
      });
      if (result.count !== 1) throw new EmployeeApiError(409, "SHIFT_CHANGED", "Your shift changed. Please refresh.");
      openShift = null;
    }
    return {
      employee: { firstName: employee.firstName, lastName: employee.lastName },
      timeZone: COMPANY_TIME_ZONE,
      serverTime: currentTime.toISOString(),
      openShift,
      ...clockPermissions(currentTime, openShift),
    };
  }, { isolationLevel: "Serializable" });
}
