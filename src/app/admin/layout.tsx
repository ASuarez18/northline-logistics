import type { ReactNode } from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f3f5f2]">
      <AdminSidebar />

      <div className="ml-63 min-h-screen w-[calc(100%-252px)]">
        <main className="mx-auto max-w-360 px-10.5 pb-17.5 pt-11">
          {children}
        </main>
      </div>
    </div>
  );
}