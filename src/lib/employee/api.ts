import { EmployeeApiError } from "./errors";
import { getEmployeeSessionUserId } from "./session-user";
import { executeEmployeeOperation } from "../services/clock.service";

type Operation = "status" | "timesheet" | "clock-in" | "clock-out";
type Dependencies = {
  sessionUserId: () => Promise<string | null>;
  execute: (userId: string, operation: Operation, week?: string | null) => Promise<unknown>;
};
const dependencies: Dependencies = {
  sessionUserId: getEmployeeSessionUserId,
  execute: async (userId, operation, week) => {
    const { prisma } = await import("../prisma");
    return executeEmployeeOperation(prisma, userId, operation, week);
  },
};

export async function employeeApi(request: Request, operation: Operation, deps = dependencies) {
  const json = (body: unknown, status = 200) => Response.json(body, {
    status, headers: { "Cache-Control": "private, no-store", Vary: "Cookie" },
  });
  try {
    const userId = await deps.sessionUserId();
    if (!userId) throw new EmployeeApiError(401, "UNAUTHENTICATED", "Please sign in again.");
    const url = new URL(request.url);
    if (operation === "clock-in" || operation === "clock-out") {
      // Cookie-authenticated mutations are accepted only from this application's origin.
      if (request.headers.get("origin") !== url.origin) {
        throw new EmployeeApiError(403, "INVALID_ORIGIN", "This request is not allowed.");
      }
    }
    return json(await deps.execute(userId, operation, url.searchParams.get("weekStart")));
  } catch (error) {
    if (error instanceof EmployeeApiError) return json({ error: { code: error.code, message: error.message } }, error.status);
    const code = typeof error === "object" && error !== null && "code" in error ? error.code : null;
    if (code === "P2002" || code === "P2034") {
      return json({ error: { code: "SHIFT_CHANGED", message: "Your shift changed. Please refresh and try again." } }, 409);
    }
    console.error("Employee API request failed", error);
    return json({ error: { code: "INTERNAL_ERROR", message: "Your dashboard is temporarily unavailable." } }, 500);
  }
}
