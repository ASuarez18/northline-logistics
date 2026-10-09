import { redirect } from "next/navigation";

import LoginForm from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth/current-user";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(user.role === "ADMIN" ? "/admin/dashboard" : "/employee");
  }
  return (
    <main className="grid min-h-screen grid-cols-[minmax(370px,41%)_1fr] bg-white max-[820px]:grid-cols-1">
      {/* Brand panel */}
      <section className="relative flex flex-col overflow-hidden bg-ink px-14 py-10.5 text-white max-[820px]:hidden">
        <div className="relative z-10">
          <p className="font-heading text-lg font-bold">Northline</p>

          <p className="mt-1 text-[9px] font-bold uppercase tracking-[2.6px] text-[#91a4a8]">
            Employee Portal
          </p>
        </div>

        <div className="relative z-10 my-auto">
          <p className="text-xs font-bold uppercase tracking-[1.7px] text-orange">
            Workforce Management
          </p>

          <h1 className="my-5.5 max-w-lg font-heading text-[clamp(40px,4vw,58px)] font-bold leading-[1.08] tracking-[-2.4px]">
            Your workday,
            <br />
            simplified.
          </h1>

          <p className="max-w-100 leading-[1.6] text-[#aebfc2]">
            Access your employee portal to manage your workday and stay
            connected with Northline.
          </p>
        </div>

        <small className="relative z-10 text-[#758b8f]">
          © 2026 Northline
        </small>

        {/* Decorative pattern */}
        <div className="absolute -bottom-45 -right-75 h-150 w-150 rotate-45 border border-[#24434b]" />
      </section>

      {/* Login */}
      <section className="flex flex-col items-center justify-center px-11 py-11 max-[820px]:px-6 max-[820px]:py-8">
        <div className="w-full max-w-107.5">
          <div className="mb-6 grid size-11.75 place-items-center rounded-[9px] bg-orange-soft font-heading font-bold text-orange-dark">
            A
          </div>

          <h2 className="font-heading text-[32px] font-bold tracking-[-1.1px] text-ink">
            Welcome back
          </h2>

          <p className="mb-7.5 mt-2 text-muted">
            Sign in to access your account.
          </p>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}
