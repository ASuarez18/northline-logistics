import { prisma } from "@/lib/db/prisma";

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
