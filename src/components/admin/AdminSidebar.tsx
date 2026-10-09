import Link from "next/link";

import AdminNavigation from "@/components/admin/AdminNavigation";
import LogoutButton from "@/components/auth/LogoutButton";
import { ChartNoAxesColumnIncreasing } from "lucide-react";

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
          className="flex w-fit items-center gap-3"
          aria-label="Northline Admin Dashboard"
        >
          <ChartNoAxesColumnIncreasing
            size={38}
            strokeWidth={4}
            className="shrink-0 text-orange"
            aria-hidden="true"
          />

          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold leading-none tracking-tight text-white">
              Northline
            </span>

            <span className="mt-1.5 text-[8px]  uppercase tracking-[1.5px] text-white/50">
              Administration Portal
            </span>
          </div>
        </Link>
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

        <p className="mt-1 truncate text-[10px] text-white/50">{user.email}</p>
      </div>

      <div className="mt-3">
        <LogoutButton />
      </div>
    </aside>
  );
}
