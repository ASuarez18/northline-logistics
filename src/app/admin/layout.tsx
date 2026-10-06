import type { ReactNode } from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileNav from "@/components/admin/AdminMobileNav";
import { requireAdmin } from "@/lib/auth/current-user";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await requireAdmin();
  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar user={user} />
      <AdminMobileNav user={user} />

      <div className="min-h-screen lg:ml-63">
        <main className="mx-auto max-w-360 px-4 pb-12 pt-6 sm:px-6 lg:px-10.5 lg:pb-17.5 lg:pt-11">
          {children}
        </main>
      </div>
    </div>
  );
}
