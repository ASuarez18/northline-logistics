import type { ReactNode } from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth/current-user";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await requireAdmin();
  return (
    <div className="min-h-screen bg-[#f3f5f2]">
      <AdminSidebar user={user} />

      <div className="ml-63 min-h-screen w-[calc(100%-252px)]">
        <main className="mx-auto max-w-360 px-10.5 pb-17.5 pt-11">
          {children}
        </main>
      </div>
    </div>
  );
}
