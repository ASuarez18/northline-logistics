import assert from "node:assert/strict";
import { test } from "node:test";
import type { PrismaClient } from "../generated/prisma/client";
import { executeEmployeeOperation } from "../services/clock.service";
import { EmployeeApiError } from "./errors";
import { clockPermissions } from "./clock-rules";

function fixture() {
  let shift: { id: string; clockIn: Date; clockOut: Date | null } | null = null;
  const tx = {
    $queryRaw: async () => [{ id: "employee", firstName: "Demo", lastName: "Employee", role: "EMPLOYEE", isActive: true }],
    shift: {
      findFirst: async () => shift?.clockOut ? null : shift,
      create: async ({ data }: { data: { clockIn: Date } }) => {
        shift = { id: "shift", clockIn: data.clockIn, clockOut: null };
        return shift;
      },
      updateMany: async ({ data }: { data: { clockOut: Date } }) => {
        assert.ok(shift);
        shift.clockOut = data.clockOut;
        return { count: 1 };
      },
    },
  };
  return { $transaction: async (run: (value: typeof tx) => Promise<unknown>) => run(tx) } as unknown as PrismaClient;
}

test("clock-in response enables clock-out without refreshing, then clock-out succeeds", async () => {
  const db = fixture();
  const start = new Date("2026-10-06T16:00:00Z");
  const result = await executeEmployeeOperation(db, "employee", "clock-in", null, () => start);
  assert.ok("canClockOut" in result);
  assert.equal(result.canClockOut, true);
  assert.equal(result.canClockIn, false);
  assert.equal(result.restriction, null);
  const closed = await executeEmployeeOperation(db, "employee", "clock-out", null, () => new Date(start.getTime() + 1));
  assert.ok("openShift" in closed);
  assert.equal(closed.openShift, null);
  assert.equal(closed.canClockIn, true);
});

test("clock-in rejects a second clock-in while a shift is already open", async () => {
  const db = fixture();
  const start = new Date("2026-10-06T16:00:00Z");

  await executeEmployeeOperation(
    db,
    "employee",
    "clock-in",
    null,
    () => start,
  );

  await assert.rejects(
    executeEmployeeOperation(
      db,
      "employee",
      "clock-in",
      null,
      () => new Date(start.getTime() + 60_000),
    ),
    (error: unknown) =>
      error instanceof EmployeeApiError &&
      error.status === 409 &&
      error.code === "ALREADY_CLOCKED_IN",
  );
});

test("clock-out rejects when there is no open shift", async () => {
  const db = fixture();
  const now = new Date("2026-10-06T16:00:00Z");

  await assert.rejects(
    executeEmployeeOperation(
      db,
      "employee",
      "clock-out",
      null,
      () => now,
    ),
    (error: unknown) =>
      error instanceof EmployeeApiError &&
      error.status === 409 &&
      error.code === "NO_OPEN_SHIFT",
  );
});

test("actual clock-out still rejects equal or earlier timestamps", async () => {
  const db = fixture();
  const start = new Date("2026-10-06T16:00:00Z");
  await executeEmployeeOperation(db, "employee", "clock-in", null, () => start);
  for (const offset of [0, -1]) {
    await assert.rejects(
      executeEmployeeOperation(db, "employee", "clock-out", null, () => new Date(start.getTime() + offset)),
      (error: unknown) => error instanceof EmployeeApiError && error.status === 422,
    );
  }
});

test("5 PM deadline and overdue shifts remain restricted", () => {
  const shift = { clockIn: new Date("2026-10-06T16:00:00Z") };
  assert.equal(clockPermissions(new Date("2026-10-07T00:00:00Z"), shift).canClockOut, true);
  assert.equal(clockPermissions(new Date("2026-10-07T00:00:00.001Z"), shift).canClockOut, false);
  assert.equal(clockPermissions(new Date("2026-10-07T16:00:00Z"), shift).canClockOut, false);
});
