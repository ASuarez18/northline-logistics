export function EmployeeInfo({
  name,
  email,
  isActive,
}: {
  name: string;
  email: string;
  isActive: boolean;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 px-4 py-3 text-sm dark:border-zinc-800">
      <p className="text-lg font-semibold">{name}</p>
      <p className="text-zinc-600 dark:text-zinc-400">{email}</p>
      <p className="mt-2">{isActive ? "Active" : "Inactive"}</p>
    </div>
  );
}
