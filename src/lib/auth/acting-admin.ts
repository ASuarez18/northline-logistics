import { prisma } from "@/lib/prisma";

export async function findActingAdminId() {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN", isActive: true },
    select: { id: true },
    take: 2,
  });

  if (admins.length !== 1) {
    return null;
  }

  return admins[0].id;
}
