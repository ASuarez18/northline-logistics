import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <p className="text-sm font-semibold text-zinc-950">Admin</p>
          <nav className="flex gap-4 text-sm text-zinc-700">
            <Link href="/admin/dashboard" className="hover:text-zinc-950">
              Dashboard
            </Link>
            <Link href="/admin/employees" className="hover:text-zinc-950">
              Employees
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
