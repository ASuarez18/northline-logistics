"use server";

import { findActingAdminId } from "@/lib/auth/acting-admin";
import { prisma } from "@/lib/db/prisma";
import { parseCompanyDateTime } from "@/lib/time/company-time";
import { closeShiftSchema } from "@/lib/validations/shift";
import { revalidatePath } from "next/cache";

export async function closeShift(formData: FormData) {
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

  const adminId = await findActingAdminId();
  if (!adminId) {
    return {
      error: "An admin account is required to record who closed this shift.",
    };
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
          changedById: adminId,
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
