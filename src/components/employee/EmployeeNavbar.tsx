import LogoutButton from "@/components/auth/LogoutButton";
import { ChartNoAxesColumnIncreasing } from "lucide-react";

type EmployeeNavbarProps = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

export default function EmployeeNavbar({ user }: EmployeeNavbarProps) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex min-h-16 max-w-296 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
          <ChartNoAxesColumnIncreasing
            size={32}
            strokeWidth={4}
            className="shrink-0 text-orange sm:size-9"
            aria-hidden="true"
          />

          <div className="flex flex-col">
            <span className="font-heading text-base font-bold leading-none tracking-tight text-ink">
              Northline
            </span>

            <span className="mt-1.5 text-[8px] font-semibold uppercase tracking-[1.5px] text-muted">
              Employee Portal
            </span>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="hidden min-w-0 text-right sm:block">
            <p className="truncate text-xs font-semibold text-ink">
              {user.firstName} {user.lastName}
            </p>

            <p className="mt-0.5 max-w-48 truncate text-[10px] text-muted lg:max-w-64">
              {user.email}
            </p>
          </div>

          <div className="hidden h-8 w-px bg-border sm:block" />

          <LogoutButton variant="header" />
        </div>
      </div>
    </header>
  );
}
