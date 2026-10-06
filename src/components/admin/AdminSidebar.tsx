import Link from "next/link";

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
    <aside className="fixed inset-y-0 left-0 z-30 flex w-63 flex-col bg-ink px-4.5 pb-4.5 pt-7 text-white">
      <div className="px-2.5 pb-9.5">
        <Link
          href="/admin/dashboard"
          className="font-heading text-lg font-bold"
        >
          ABC Holding
        </Link>

        <p className="mt-1 text-[10px] uppercase tracking-[2px] text-[#80969a]">
          Administration Portal
        </p>
      </div>

      <div>
        <p className="px-3 pb-2.5 text-[9px] font-bold uppercase tracking-[1.4px] text-[#71898d]">
          Workspace
        </p>

        <nav className="grid gap-1">
          <Link
            href="/admin/dashboard"
            className="flex h-11 items-center rounded-md px-3 text-[13px] font-semibold text-[#9eb0b3] transition hover:bg-white/5 hover:text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/employees"
            className="flex h-11 items-center rounded-md px-3 text-[13px] font-semibold text-[#9eb0b3] transition hover:bg-white/5 hover:text-white"
          >
            Employees
          </Link>
        </nav>
      </div>

      <div className="mt-auto border-t border-[#274149] px-1.75 pt-4.25">
        <p className="text-xs font-semibold">
          {user.firstName} {user.lastName}
        </p>

        <p className="mt-1 truncate text-[10px] text-[#80969a]">{user.email}</p>
      </div>

      <div className="mt-3">
        <LogoutButton />
      </div>
    </aside>
  );
}
