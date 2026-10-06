import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth/password";

async function main() {
  const adminPasswordHash = await hashPassword("Admin123!");
  const employeePasswordHash = await hashPassword("Employee123!");

  await prisma.user.upsert({
    where: {
      email: "admin@abcholding.com",
    },
    update: {},
    create: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@abcholding.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: {
      email: "employee@abcholding.com",
    },
    update: {},
    create: {
      firstName: "Demo",
      lastName: "Employee",
      email: "employee@abcholding.com",
      passwordHash: employeePasswordHash,
      role: "EMPLOYEE",
    },
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
