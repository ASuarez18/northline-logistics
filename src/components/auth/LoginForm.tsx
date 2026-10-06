"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type LoginResponse = {
  error?: string;
  redirectTo?: string;
};

export default function LoginForm() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");
    const rememberMe = formData.get("rememberMe") === "on";

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok) {
        setError(data.error ?? "Unable to login.");
        return;
      }

      if (!data.redirectTo) {
        setError("Unable to determine login destination.");
        return;
      }

      router.push(data.redirectTo);
      router.refresh();
    } catch {
      setError("Unable to login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
  <form
    onSubmit={handleSubmit}
    className="grid gap-[18px]"
  >
    <label className="block">
      <span className="mb-2 block text-[13px] font-semibold text-[#3d5055]">
        Email address
      </span>

      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@abcholding.com"
        required
        className="min-h-[46px] w-full rounded-[7px] border border-[#cbd5d5] bg-white px-[13px] text-text outline-none transition placeholder:text-[#9ba8aa] focus:border-ink-3 focus:ring-3 focus:ring-ink-3/10"
      />
    </label>

    <label className="block">
      <span className="mb-2 block text-[13px] font-semibold text-[#3d5055]">
        Password
      </span>

      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter your password"
        required
        className="min-h-[46px] w-full rounded-[7px] border border-[#cbd5d5] bg-white px-[13px] text-text outline-none transition placeholder:text-[#9ba8aa] focus:border-ink-3 focus:ring-3 focus:ring-ink-3/10"
      />
    </label>

    <label className="flex cursor-pointer items-center gap-2 text-[13px] text-muted">
      <input
        name="rememberMe"
        type="checkbox"
        className="size-4 accent-orange"
      />

      Remember me
    </label>

    {error && (
      <div
        role="alert"
        className="rounded-md bg-danger-soft px-[13px] py-[11px] text-[13px] text-danger"
      >
        {error}
      </div>
    )}

    <button
      type="submit"
      disabled={isSubmitting}
      className="mt-1 min-h-12 w-full rounded-[7px] bg-orange px-[17px] text-sm font-semibold text-white shadow-[0_3px_10px_rgba(237,106,50,.18)] transition hover:-translate-y-px hover:bg-orange-dark disabled:cursor-not-allowed disabled:bg-[#edf0ee] disabled:text-[#9caaaa] disabled:shadow-none disabled:hover:translate-y-0"
    >
      {isSubmitting ? "Signing in..." : "Sign in"}
    </button>
  </form>
);
}
