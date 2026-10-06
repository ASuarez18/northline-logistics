import { employeeApi } from "@/lib/employee/api";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return employeeApi(request, "status");
}
