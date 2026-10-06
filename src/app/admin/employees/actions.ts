"use server";

import { Prisma } from "@/lib/generated/prisma/client";
import { hashPassword } from "@/lib/auth/password";
import { requireActionAdmin } from "@/lib/auth/action-auth";
import { prisma } from "@/lib/prisma";
import {
  createEmployeeSchema,
  setEmployeeActiveSchema,
} from "@/lib/validations/employee";
import { revalidatePath } from "next/cache";

export async function createEmployee(formData: FormData) {
  const auth = await requireActionAdmin();

  if (auth.error) {
    return { error: auth.error };
  }

  const parsed = createEmployeeSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }

  try {
    await prisma.user.create({
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        passwordHash: await hashPassword(parsed.data.password),
        role: "EMPLOYEE",
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "An employee with this email already exists." };
    }

    throw error;
  }

  revalidatePath("/admin/employees");
  return {};
}

export async function setEmployeeActive(employeeId: string, isActive: boolean) {
  const auth = await requireActionAdmin();

  if (auth.error) {
    return { error: auth.error };
  }

  const parsed = setEmployeeActiveSchema.safeParse({
    employeeId,
    isActive,
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the request.",
    };
  }

  const employee = await prisma.user.findUnique({
    where: { id: parsed.data.employeeId },
    select: { role: true },
  });

  if (!employee || employee.role !== "EMPLOYEE") {
    return { error: "Employee not found." };
  }

  await prisma.user.update({
    where: { id: parsed.data.employeeId },
    data: { isActive: parsed.data.isActive },
  });

  revalidatePath("/admin/employees");
  revalidatePath(`/admin/employees/${parsed.data.employeeId}`);
  return {};
}
