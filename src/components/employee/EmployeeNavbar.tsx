import LogoutButton from "@/components/auth/LogoutButton";

type EmployeeNavbarProps = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

export default function EmployeeNavbar({
  user,
}: EmployeeNavbarProps) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex min-h-16 max-w-296 items-center justify-between px-6">
        <div>
          <p className="font-heading text-base font-bold text-ink">
            ABC Holding
          </p>

          <p className="text-[9px] font-bold uppercase tracking-[1.8px] text-muted">
            Employee Portal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs font-semibold text-ink">
              {user.firstName} {user.lastName}
            </p>

            <p className="mt-0.5 text-[10px] text-muted">
              {user.email}
            </p>
          </div>

          <div className="h-8 w-px bg-border" />

          <LogoutButton variant="header" />
        </div>
      </div>
    </header>
  );
}