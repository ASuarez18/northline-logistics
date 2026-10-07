import { employeeApi } from "@/lib/employee/api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return employeeApi(request, "clock-in");
}
