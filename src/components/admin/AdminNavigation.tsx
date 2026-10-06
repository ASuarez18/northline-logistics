"use client";

import Link from "next/link";
import { LayoutDashboard, Users } from "lucide-react";
import { usePathname } from "next/navigation";

const navigation = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/employees",
    label: "Employees",
    icon: Users,
  },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1">
      {navigation.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/admin/dashboard"
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "flex min-h-11 items-center gap-3 rounded-md bg-orange px-3 text-[13px] font-semibold text-white transition"
                : "flex min-h-11 items-center gap-3 rounded-md px-3 text-[13px] font-semibold text-white/65 transition hover:bg-ink-2 hover:text-white"
            }
          >
            <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
