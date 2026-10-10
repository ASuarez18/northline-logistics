import type { Metadata } from "next";
import EmployeeDashboard from "@/components/employee/EmployeeDashboard";

export const metadata: Metadata = {
  title: "My workday | Northline",
  description: "Your employee time clock and weekly timesheet.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmployeePage() {
  return <EmployeeDashboard />;
}
