"use server";

import { prisma } from "@/lib/prisma";
import { parseCompanyDateTime } from "@/lib/time/company-time";
import { requireActionAdmin } from "@/lib/auth/action-auth";
import { closeShiftSchema, correctShiftSchema } from "@/lib/validations/shift";

import { revalidatePath } from "next/cache";




export async function closeShift(formData: FormData) {
  const auth = await requireActionAdmin();

  if (auth.error) {
    return { error: auth.error };
  }

  const parsed = closeShiftSchema.safeParse({
    shiftId: formData.get("shiftId"),
    clockOut: formData.get("clockOut"),
    reason: formData.get("reason"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }

  const clockOut = parseCompanyDateTime(parsed.data.clockOut);
  if (!clockOut) {
    return { error: "Enter a valid clock-out time." };
  }

  try {
    const employeeId = await prisma.$transaction(async (tx) => {
      const shift = await tx.shift.findUnique({
        where: { id: parsed.data.shiftId },
      });

      if (!shift || shift.clockOut) {
        throw new Error("CLOSED");
      }

      if (clockOut <= shift.clockIn) {
        throw new Error("ORDER");
      }

      await tx.shift.update({
        where: { id: shift.id },
        data: { clockOut },
      });
      await tx.shiftAudit.create({
        data: {
          shiftId: shift.id,
          changedById: auth.user.id,
          previousClockIn: shift.clockIn,
          previousClockOut: null,
          newClockIn: shift.clockIn,
          newClockOut: clockOut,
          reason: parsed.data.reason,
        },
      });

      return shift.userId;
    });

    revalidatePath("/admin/dashboard");
    revalidatePath(`/admin/employees/${employeeId}`);
    return {};
  } catch (error) {
    if (error instanceof Error && error.message === "CLOSED") {
      return { error: "This shift is already closed." };
    }

    if (error instanceof Error && error.message === "ORDER") {
      return { error: "Clock out must be after clock in." };
    }

    throw error;
  }
}

export async function correctShift(formData: FormData) {
  const auth = await requireActionAdmin();

  if (auth.error) {
    return { error: auth.error };
  }

  const parsed = correctShiftSchema.safeParse({
    shiftId: formData.get("shiftId"),
    clockIn: formData.get("clockIn"),
    clockOut: formData.get("clockOut"),
    reason: formData.get("reason"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }

  const clockIn = parseCompanyDateTime(parsed.data.clockIn);
  const clockOut = parseCompanyDateTime(parsed.data.clockOut);
  if (!clockIn) {
    return { error: "Enter a valid clock-in time." };
  }
  if (!clockOut) {
    return { error: "Enter a valid clock-out time." };
  }
  if (clockOut <= clockIn) {
    return { error: "Clock out must be after clock in." };
  }

  try {
    const employeeId = await prisma.$transaction(async (tx) => {
      const shift = await tx.shift.findUnique({
        where: { id: parsed.data.shiftId },
      });

      if (!shift) {
        throw new Error("MISSING");
      }
      if (!shift.clockOut) {
        throw new Error("OPEN");
      }
      if (
        clockIn.getTime() === shift.clockIn.getTime() &&
        clockOut.getTime() === shift.clockOut.getTime()
      ) {
        throw new Error("UNCHANGED");
      }

      await tx.shift.update({
        where: { id: shift.id },
        data: { clockIn, clockOut },
      });
      await tx.shiftAudit.create({
        data: {
          shiftId: shift.id,
          changedById: auth.user.id,
          previousClockIn: shift.clockIn,
          previousClockOut: shift.clockOut,
          newClockIn: clockIn,
          newClockOut: clockOut,
          reason: parsed.data.reason,
        },
      });

      return shift.userId;
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/employees");
    revalidatePath(`/admin/employees/${employeeId}`);
    return {};
  } catch (error) {
    if (error instanceof Error && error.message === "MISSING") {
      return { error: "This shift no longer exists." };
    }
    if (error instanceof Error && error.message === "OPEN") {
      return { error: "Close this shift before editing it." };
    }
    if (error instanceof Error && error.message === "UNCHANGED") {
      return { error: "Change the clock-in or clock-out time." };
    }

    throw error;
  }
}
