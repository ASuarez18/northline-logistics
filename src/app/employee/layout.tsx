import type { ReactNode } from "react";

import EmployeeNavbar from "@/components/employee/EmployeeNavbar";
import { requireEmployee } from "@/lib/auth/current-user";

type EmployeeLayoutProps = {
  children: ReactNode;
};

export default async function EmployeeLayout({
  children,
}: EmployeeLayoutProps) {
  const user = await requireEmployee();

  return (
    <div className="min-h-screen bg-cream">
      <EmployeeNavbar user={user} />

      <main className="mx-auto w-full max-w-296 px-6 py-10">
        {children}
      </main>
    </div>
  );
}