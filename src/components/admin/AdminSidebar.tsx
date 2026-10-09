import Link from "next/link";

import AdminNavigation from "@/components/admin/AdminNavigation";
import LogoutButton from "@/components/auth/LogoutButton";

type AdminSidebarProps = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

export default function AdminSidebar({ user }: AdminSidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-63 flex-col bg-ink px-4.5 pb-4.5 pt-7 text-white lg:flex">
      <div className="px-2.5 pb-9.5">
        <Link
          href="/admin/dashboard"
          className="font-heading text-lg font-bold"
        >
          Northline
        </Link>

        <p className="mt-1 text-[10px] uppercase tracking-[2px] text-white/50">
          Administration Portal
        </p>
      </div>

      <div>
        <p className="px-3 pb-2.5 text-[9px] font-bold uppercase tracking-[1.4px] text-white/45">
          Workspace
        </p>

        <AdminNavigation />
      </div>

      <div className="mt-auto border-t border-ink-3 px-1.75 pt-4.25">
        <p className="text-xs font-semibold">
          {user.firstName} {user.lastName}
        </p>

        <p className="mt-1 truncate text-[10px] text-white/50">
          {user.email}
        </p>
      </div>

      <div className="mt-3">
        <LogoutButton />
      </div>
    </aside>
  );
}