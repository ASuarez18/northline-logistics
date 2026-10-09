import { redirect } from "next/navigation";

import LoginForm from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth/current-user";

import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(user.role === "ADMIN" ? "/admin/dashboard" : "/employee");
  }
  return (
    <main className="grid min-h-screen grid-cols-[minmax(370px,41%)_1fr] bg-white max-[820px]:grid-cols-1">
      {/* Brand panel */}
      <section className="relative flex flex-col overflow-hidden bg-ink px-14 py-10.5 text-white max-[820px]:hidden">
        <Link
          href="/"
          aria-label="Return to Northline homepage"
          className="relative z-10 flex w-fit items-center gap-3 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
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

            <span className="mt-1.5 text-[8px] font-semibold uppercase tracking-[2.2px] text-white/50">
              Employee Portal
            </span>
          </div>
        </Link>

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

        <small className="relative z-10 text-[#758b8f]">© 2026 Northline</small>

        {/* Decorative pattern */}
        <div className="absolute -bottom-45 -right-75 h-150 w-150 rotate-45 border border-[#24434b]" />
      </section>

      {/* Login */}
      <section className="flex flex-col items-center justify-center px-11 py-11 max-[820px]:px-6 max-[820px]:py-8">
        <div className="w-full max-w-107.5">
          {/* Back to homepage */}
          <Link
            href="/"
            className="mb-2 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-orange-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
            Back to homepage
          </Link>

          {/* Login heading */}
          <div className="mb-8 flex items-center gap-4">
            <div className="grid size-18 shrink-0 place-items-center rounded-[9px] bg-orange-soft text-orange-dark">
              <Building2 size={48} strokeWidth={1.5} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h2 className="font-heading text-[clamp(24px,5vw,32px)] font-bold tracking-[-1.1px] text-ink">
                Welcome back
              </h2>

              <p className="mt-1 text-sm text-muted">
                Sign in to access your account.
              </p>
            </div>
          </div>

          {/* Authentication form */}
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
