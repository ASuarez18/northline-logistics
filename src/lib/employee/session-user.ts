import { requireApiEmployee } from "../auth/api-auth";
import { EmployeeApiError } from "./errors";

export async function getEmployeeSessionUserId(): Promise<string | null> {
  const result = await requireApiEmployee();
  if (result.error === "FORBIDDEN") {
    throw new EmployeeApiError(403, "FORBIDDEN", "An employee account is required.");
  }
  return result.user?.id ?? null;
}
