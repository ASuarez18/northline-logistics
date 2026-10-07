import type { Metadata } from "next";
import EmployeeDashboard from "@/components/employee/EmployeeDashboard";

export const metadata: Metadata = {
  title: "My workday | ABC Holding",
  description: "Your employee time clock and weekly timesheet.",
};

export default function EmployeePage() {
  return <EmployeeDashboard />;
}
