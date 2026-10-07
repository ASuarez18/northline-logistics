import assert from "node:assert/strict";
import { test } from "node:test";
import { DashboardError, formatTime, moveWeek, request, statusSchema, timesheetSchema } from "./dashboard";

const status = {
  employee: { firstName: "Alex", lastName: "Lee" },
  timeZone: "America/Vancouver", serverTime: "2026-10-06T16:02:00Z",
  openShift: null, canClockIn: true, canClockOut: false, restriction: null,
};

test("clock requests use session cookies without supplying identity or timestamps", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async (url: string, init: RequestInit) => {
    calls++;
    assert.equal(url, "/api/employee/clock-in");
    assert.equal(init.method, "POST");
    assert.equal(init.credentials, "same-origin");
    assert.equal(init.cache, "no-store");
    assert.equal(init.body, undefined);
    return Response.json(status);
  });
  assert.deepEqual(await request("clock-in", statusSchema, { method: "POST" }), status);
  assert.equal(calls, 1);
});

test("expired session is surfaced and a failed mutation is not retried", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => {
    calls++;
    return new Response(null, { status: 401 });
  });
  await assert.rejects(request("clock-out", statusSchema, { method: "POST" }), (error: unknown) => error instanceof DashboardError && error.status === 401);
  assert.equal(calls, 1);
});

test("malformed success responses cannot become valid clock state", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("<html>Login</html>"));
  await assert.rejects(request("status", statusSchema), DashboardError);
  assert.equal(statusSchema.safeParse({ ...status, timeZone: "invalid" }).success, false);
});

test("weekly totals come from the response, independently of displayed shifts", () => {
  const sheet = timesheetSchema.parse({ weekStart: "2026-10-05", totalSeconds: 7200, shifts: [] });
  assert.equal(sheet.totalSeconds, 7200);
});

test("calendar navigation crosses years and DST weeks without local timezone drift", () => {
  assert.equal(moveWeek("2026-12-28", 1), "2027-01-04");
  assert.equal(moveWeek("2026-11-02", -1), "2026-10-26");
  assert.equal(formatTime("2026-10-06T16:02:00Z", "America/Vancouver"), "9:02 a.m.");
});
