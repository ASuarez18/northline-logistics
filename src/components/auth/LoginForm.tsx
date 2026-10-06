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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      <label>
        <input name="rememberMe" type="checkbox" />
        Remember me
      </label>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
