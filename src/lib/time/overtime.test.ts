import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateOvertimeSeconds } from "./overtime";

function overtime(clockIn: string, clockOut: string) {
  return calculateOvertimeSeconds(new Date(clockIn), new Date(clockOut));
}

test("regular shift has no overtime", () => {
  assert.equal(overtime("2026-10-06T15:00:00Z", "2026-10-06T23:00:00Z"), 0);
});

test("shift from 4 PM to 6 PM has one overtime hour", () => {
  assert.equal(overtime("2026-10-06T23:00:00Z", "2026-10-07T01:00:00Z"), 3600);
});

test("shift starting after 5 PM is entirely overtime", () => {
  assert.equal(overtime("2026-10-07T00:30:00Z", "2026-10-07T02:00:00Z"), 5400);
});

test("overnight shift only counts time after 5 PM on each day", () => {
  assert.equal(overtime("2026-10-07T06:00:00Z", "2026-10-07T08:00:00Z"), 3600);
});

test("invalid or zero-length shifts have no overtime", () => {
  assert.equal(overtime("2026-10-07T01:00:00Z", "2026-10-07T01:00:00Z"), 0);

  assert.equal(overtime("2026-10-07T02:00:00Z", "2026-10-07T01:00:00Z"), 0);
});
