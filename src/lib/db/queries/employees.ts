import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export function findEmployee(id: string) {
  return prisma.user.findFirst({
    where: { id, role: "EMPLOYEE" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      isActive: true,
    },
  });
}

type EmployeeShiftRow = {
  id: string;
  clockIn: Date;
  clockOut: Date | null;
  durationSeconds: number | null;
};

export async function findEmployeeShifts(
  employeeId: string,
  weekStart: Date,
  weekEnd: Date,
) {
  const rows = await prisma.$queryRaw<EmployeeShiftRow[]>(Prisma.sql`
    SELECT
      id,
      "clockIn",
      "clockOut",
      CASE
        WHEN "clockOut" IS NULL THEN NULL
        ELSE EXTRACT(EPOCH FROM ("clockOut" - "clockIn"))::float
      END AS "durationSeconds"
    FROM "Shift"
    WHERE "userId" = ${employeeId}
      AND "clockIn" >= ${weekStart}
      AND "clockIn" < ${weekEnd}
    ORDER BY "clockIn" ASC
  `);

  return rows.map((row) => ({
    ...row,
    durationSeconds:
      row.durationSeconds === null ? null : Number(row.durationSeconds),
  }));
}

export async function findEmployeeWeekTotal(
  employeeId: string,
  weekStart: Date,
  weekEnd: Date,
) {
  const rows = await prisma.$queryRaw<{ totalSeconds: number }[]>(Prisma.sql`
    SELECT
      COALESCE(
        EXTRACT(EPOCH FROM SUM("clockOut" - "clockIn")),
        0
      )::float AS "totalSeconds"
    FROM "Shift"
    WHERE "userId" = ${employeeId}
      AND "clockOut" IS NOT NULL
      AND "clockIn" >= ${weekStart}
      AND "clockIn" < ${weekEnd}
  `);

  return Number(rows[0]?.totalSeconds ?? 0);
}

export function findEmployeeShiftAudits(
  employeeId: string,
  weekStart: Date,
  weekEnd: Date,
) {
  return prisma.shiftAudit.findMany({
    where: {
      shift: {
        userId: employeeId,
        clockIn: {
          gte: weekStart,
          lt: weekEnd,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      shiftId: true,
      previousClockIn: true,
      previousClockOut: true,
      newClockIn: true,
      newClockOut: true,
      reason: true,
      createdAt: true,
      changedBy: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}
