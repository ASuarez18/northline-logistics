import type { Prisma } from "../../generated/prisma/client";

export function findOpenShift(db: Prisma.TransactionClient, userId: string) {
  return db.shift.findFirst({
    where: { userId, clockOut: null },
    select: { id: true, clockIn: true, clockOut: true },
  });
}

export async function readWeeklyShifts(db: Prisma.TransactionClient, userId: string, start: Date, end: Date) {
  const shifts = await db.shift.findMany({
    where: { userId, clockIn: { gte: start, lt: end } },
    select: { id: true, clockIn: true, clockOut: true },
    orderBy: [{ clockIn: "asc" }, { id: "asc" }],
  });
  // Parameterized SQL: aggregation belongs to PostgreSQL, not the browser.
  const [total] = await db.$queryRaw<Array<{ totalSeconds: number }>>`
    SELECT COALESCE(SUM(EXTRACT(EPOCH FROM ("clockOut" - "clockIn"))), 0)::double precision AS "totalSeconds"
    FROM "Shift"
    WHERE "userId" = ${userId}
      AND "clockIn" >= ${start} AND "clockIn" < ${end}
      AND "clockOut" IS NOT NULL
  `;
  return { shifts, totalSeconds: total.totalSeconds };
}
