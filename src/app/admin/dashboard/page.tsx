export default function AdminDashboardPage() {
  return (
    <>
      <header className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[1.7px] text-orange-dark">
          Administration
        </p>

        <h1 className="mt-2 font-heading text-[31px] font-bold tracking-[-1.1px] text-ink">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted">
          Monitor employee attendance and working hours.
        </p>
      </header>

      <section className="rounded-[10px] border border-border bg-surface p-6">
        <h2 className="font-heading text-lg font-bold text-ink">
          Employee activity
        </h2>

        <p className="mt-2 text-sm text-muted">
          Dashboard data will appear here.
        </p>
      </section>
    </>
  );
}