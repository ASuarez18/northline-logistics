"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

type LogoutButtonProps = {
  variant?: "sidebar" | "header";
};

export default function LogoutButton({
  variant = "sidebar",
}: LogoutButtonProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to logout.");
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  }

  const styles = {
    sidebar:
      "flex items-center gap-2 text-[10px] font-semibold text-[#80969a] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50",

    header:
      "flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-muted transition hover:bg-sand/50 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50",
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={styles[variant]}
    >
      <LogOut size={14} strokeWidth={1.8} aria-hidden="true" />

      {isLoggingOut ? "Signing out..." : "Sign out"}
    </button>
  );
}
