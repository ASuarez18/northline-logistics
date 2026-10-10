/** Northline demo-only destructive seed. Copy to prisma/seed.ts. */
import "dotenv/config";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth/password";

const TZ = "America/Vancouver";
const EMPLOYEE_COUNT = 44;
const OPEN_SHIFT_COUNT = 6;
const DEMO_PASSWORD = "Employee123!";
const ADMIN_PASSWORD = "Admin123!";

const firstNames = [
  "Olivia", "Liam", "Emma", "Noah", "Ava", "Ethan", "Sophia", "Lucas",
  "Mia", "Mason", "Isabella", "Logan", "Amelia", "James", "Charlotte", "Benjamin",
  "Harper", "Elijah", "Evelyn", "Henry", "Abigail", "Alexander", "Ella", "Daniel",
  "Grace", "William", "Chloe", "Michael", "Lily", "Samuel", "Zoe", "David",
  "Aria", "Joseph", "Nora", "Matthew", "Layla", "Jack", "Hannah", "Owen",
  "Victoria", "Leo", "Stella", "Isaac",
];
const lastNames = [
  "Chen", "Patel", "Williams", "Nguyen", "Brown", "Kim", "Singh", "Johnson",
  "Garcia", "Wilson", "Martinez", "Lee", "Taylor", "Anderson", "Lopez", "Thomas",
  "Clark", "Wright", "Walker", "Scott", "Green", "Baker", "Adams", "Nelson",
  "Hill", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Phillips", "Evans",
  "Turner", "Parker", "Collins", "Edwards", "Stewart", "Morris", "Rogers", "Reed",
  "Cook", "Morgan", "Bell", "Murphy",
];

// Stable pseudo-randomness: the same day/employee produces the same schedule.
function random(seed: number) {
  let x = seed >>> 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return (x >>> 0) / 4294967296;
}

function localDateParts(date: Date) {
  const d = toZonedTime(date, TZ);
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(), weekday: d.getDay(), hour: d.getHours() };
}

function localMiddayDaysAgo(daysAgo: number, reference: Date) {
  const { year, month, day } = localDateParts(reference);
  const base = new Date(Date.UTC(year, month - 1, day - daysAgo, 12));
  return { year: base.getUTCFullYear(), month: base.getUTCMonth() + 1, day: base.getUTCDate(), weekday: base.getUTCDay() };
}

function atLocal(day: { year: number; month: number; day: number }, hour: number, minute = 0) {
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  const date = `${day.year}-${String(day.month).padStart(2, "0")}-${String(day.day).padStart(2, "0")}T${hh}:${mm}:00`;
  return fromZonedTime(date, TZ);
}

async function main() {
  if (process.env.ALLOW_DESTRUCTIVE_SEED !== "YES") {
    throw new Error("Destructive seed blocked. Set ALLOW_DESTRUCTIVE_SEED=YES for your DEMO database only.");
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed with NODE_ENV=production.");
  }

  const now = new Date();
  const localNow = localDateParts(now);
  const openShiftDayOffset = localNow.hour >= 8 ? 0 : 1;
  const employeeHash = await hashPassword(DEMO_PASSWORD);
  const adminHash = await hashPassword(ADMIN_PASSWORD);

  // A single transaction ensures a failed insert rolls back the replacement.
  const summary = await prisma.$transaction(async (tx) => {
    await tx.shiftAudit.deleteMany();
    await tx.shift.deleteMany();
    await tx.user.deleteMany();

    const admins = [
      { firstName: "Morgan", lastName: "Brooks", email: "admin@northline.com" },
      { firstName: "Taylor", lastName: "Reed", email: "operations.admin@northline.com" },
      { firstName: "Jordan", lastName: "Price", email: "hr.admin@northline.com" },
    ];
    const employees = Array.from({ length: EMPLOYEE_COUNT }, (_, i) => ({
      firstName: firstNames[i],
      lastName: lastNames[i],
      email: `employee${String(i + 1).padStart(2, "0")}@northline.com`,
      passwordHash: employeeHash,
      role: "EMPLOYEE" as const,
    }));

    await tx.user.createMany({
      data: [
        ...admins.map((admin) => ({ ...admin, passwordHash: adminHash, role: "ADMIN" as const })),
        ...employees,
      ],
    });

    const createdEmployees = await tx.user.findMany({
      where: { email: { in: employees.map((employee) => employee.email) } },
      select: { id: true, email: true },
    });
    const userIds = new Map(createdEmployees.map((employee) => [employee.email, employee.id]));
    if (userIds.size !== EMPLOYEE_COUNT) {
      throw new Error("Could not resolve all seeded employee IDs.");
    }

    const shifts: { userId: string; clockIn: Date; clockOut: Date | null }[] = [];
    let closedShifts = 0;
    for (let i = 0; i < EMPLOYEE_COUNT; i++) {
      const email = employees[i].email;
      const userId = userIds.get(email)!;
      for (let daysAgo = 28; daysAgo >= 1; daysAgo--) {
        const day = localMiddayDaysAgo(daysAgo, now);
        const seed = (i + 1) * 10007 + daysAgo * 8191;
        const r = random(seed);
        if (day.weekday === 0 || (day.weekday === 6 && r > 0.22)) continue;
        if (day.weekday !== 6 && r < 0.12) continue;

        const startHour = 8 + (i % 3);
        const startMinute = [0, 10, 15, 30][Math.floor(random(seed + 3) * 4)];
        const durationMinutes = 360 + Math.floor(random(seed + 5) * 13) * 15;
        const start = atLocal(day, startHour, startMinute);
        const end = new Date(start.getTime() + durationMinutes * 60000);

        if (random(seed + 7) < 0.17 && durationMinutes >= 420) {
          const firstEnd = new Date(start.getTime() + 210 * 60000);
          const secondStart = new Date(firstEnd.getTime() + 45 * 60000);
          shifts.push({ userId, clockIn: start, clockOut: firstEnd });
          shifts.push({ userId, clockIn: secondStart, clockOut: end });
          closedShifts += 2;
        } else {
          shifts.push({ userId, clockIn: start, clockOut: end });
          closedShifts++;
        }
      }

      if (i < OPEN_SHIFT_COUNT) {
        const day = localMiddayDaysAgo(openShiftDayOffset, now);
        const scheduled = atLocal(day, 8 + (i % 3), [0, 10, 20, 30, 40, 50][i]);
        const earliest = atLocal(day, 8, 0);
        const clockIn = scheduled.getTime() <= now.getTime() ? scheduled : earliest;
        if (clockIn.getTime() <= now.getTime()) {
          shifts.push({ userId, clockIn, clockOut: null });
        }
      }
    }

    // Batched writes avoid hundreds of sequential round-trips to remote PostgreSQL.
    for (let i = 0; i < shifts.length; i += 250) {
      await tx.shift.createMany({ data: shifts.slice(i, i + 250) });
    }
    // Simulate historical administrative corrections on 20 distinct closed shifts.
    // Audit values describe the actual before/after state of each correction.
    const adminUsers = await tx.user.findMany({
      where: { email: { in: admins.map((admin) => admin.email) } },
      select: { id: true, email: true },
    });
    const adminIds = new Map(adminUsers.map((admin) => [admin.email, admin.id]));
    if (adminIds.size !== admins.length) {
      throw new Error("Could not resolve all seeded administrator IDs.");
    }

    // Use one bulk read to obtain persisted IDs, then update only selected shifts.
    const eligibleShifts = await tx.shift.findMany({
      where: { clockOut: { not: null } },
      orderBy: [{ clockIn: "asc" }, { id: "asc" }],
      select: { id: true, clockIn: true, clockOut: true },
    });
    const auditCount = Math.min(20, eligibleShifts.length);
    const audits: {
      shiftId: string;
      changedById: string;
      previousClockIn: Date;
      previousClockOut: Date;
      newClockIn: Date;
      newClockOut: Date;
      reason: string;
      createdAt: Date;
    }[] = [];
    const reasons = [
      "Corrected clock-in after employee reported a delayed kiosk sync.",
      "Adjusted clock-out based on supervisor-confirmed departure time.",
      "Corrected start and end times after timesheet review.",
      "Updated clock-in to match approved shift attendance record.",
      "Corrected clock-out after a missed punch was verified.",
    ];
    for (let i = 0; i < auditCount; i++) {
      const shift = eligibleShifts[Math.floor((i + 0.5) * eligibleShifts.length / auditCount)];
      if (!shift.clockOut) throw new Error("Expected a closed shift for audit generation.");
      const minutes = [5, 10, 15, 20][i % 4];
      const editStart = i % 3 !== 1;
      const editEnd = i % 3 !== 0;
      const newClockIn = editStart
        ? new Date(shift.clockIn.getTime() - minutes * 60000)
        : shift.clockIn;
      const newClockOut = editEnd
        ? new Date(shift.clockOut.getTime() + minutes * 60000)
        : shift.clockOut;
      const adminId = adminIds.get(admins[i % admins.length].email)!;
      audits.push({
        shiftId: shift.id,
        changedById: adminId,
        previousClockIn: shift.clockIn,
        previousClockOut: shift.clockOut,
        newClockIn,
        newClockOut,
        reason: reasons[i % reasons.length],
        createdAt: new Date(Math.min(now.getTime(), shift.clockOut.getTime() + 86400000)),
      });
      // Each chosen shift is distinct; updates are consistent with audit records.
      await tx.shift.update({
        where: { id: shift.id },
        data: { clockIn: newClockIn, clockOut: newClockOut },
      });
    }
    if (audits.length) await tx.shiftAudit.createMany({ data: audits });
    return { admins: admins.length, employees: EMPLOYEE_COUNT, closedShifts, shiftEdits: audits.length };
  }, { maxWait: 20000, timeout: 120000 });

  console.log("Northline demo database seeded successfully.");
  console.log({ ...summary, openShifts: await prisma.shift.count({ where: { clockOut: null } }) });
  console.log("Admin: admin@northline.com / Admin123!");
  console.log("Employee: employee01@northline.com / Employee123!");
}

main()
  .catch((error) => { console.error("Seed failed:", error); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
