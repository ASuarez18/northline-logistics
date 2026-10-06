import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

export type WeekTotal = {
  id: string;
  firstName: string;
  lastName: string;
  totalSeconds: number;
};

export function findClockedInShifts() {
  return prisma.shift.findMany({
    where: { clockOut: null },
    orderBy: { clockIn: "asc" },
    select: {
      id: true,
      clockIn: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function findCurrentWeekTotals(weekStart: Date, weekEnd: Date) {
  const rows = await prisma.$queryRaw<WeekTotal[]>(Prisma.sql`
    SELECT
      u.id,
      u."firstName",
      u."lastName",
      COALESCE(
        EXTRACT(EPOCH FROM SUM(s."clockOut" - s."clockIn")),
        0
      )::float AS "totalSeconds"
    FROM "User" u
    LEFT JOIN "Shift" s
      ON s."userId" = u.id
      AND s."clockOut" IS NOT NULL
      AND s."clockIn" >= ${weekStart}
      AND s."clockIn" < ${weekEnd}
    WHERE u.role = 'EMPLOYEE'::"Role"
    GROUP BY u.id, u."firstName", u."lastName"
    ORDER BY u."lastName" ASC, u."firstName" ASC
  `);

  return rows.map((row) => ({
    ...row,
    totalSeconds: Number(row.totalSeconds),
  }));
}
