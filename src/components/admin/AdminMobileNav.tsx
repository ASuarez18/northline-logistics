"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import AdminNavigation from "@/components/admin/AdminNavigation";
import LogoutButton from "@/components/auth/LogoutButton";

type AdminMobileNavProps = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

export default function AdminMobileNav({ user }: AdminMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  function closeDrawer() {
    setIsOpen(false);
  }


  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  function handleDrawerKeyDown(
    event: ReactKeyboardEvent<HTMLElement>,
  ) {
    if (event.key !== "Tab") {
      return;
    }

    const drawer = drawerRef.current;

    if (!drawer) {
      return;
    }

    const focusableElements = Array.from(
      drawer.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  function handleTransitionEnd() {
    if (!isOpen) {
      menuButtonRef.current?.focus();
    }
  }

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-surface px-4 sm:px-6 lg:hidden">
        <Link
          href="/admin/dashboard"
          className="font-heading text-base font-bold text-ink"
        >
          ABC Holding
        </Link>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation"
          aria-expanded={isOpen}
          aria-controls="admin-mobile-navigation"
          className="grid size-10 place-items-center rounded-md text-ink transition hover:bg-sand/60"
        >
          <Menu size={21} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-ink/50"
            onClick={closeDrawer}
            tabIndex={-1}
          />

          <aside
            ref={drawerRef}
            id="admin-mobile-navigation"
            aria-label="Admin navigation"
            onKeyDown={handleDrawerKeyDown}
            onTransitionEnd={handleTransitionEnd}
            className="relative flex h-full w-[min(85vw,20rem)] flex-col bg-ink px-4.5 pb-4.5 pt-5 text-white shadow-xl"
          >
            <div className="flex items-start justify-between px-2.5 pb-8">
              <div>
                <Link
                  href="/admin/dashboard"
                  onClick={closeDrawer}
                  className="font-heading text-lg font-bold"
                >
                  ABC Holding
                </Link>

                <p className="mt-1 text-[10px] uppercase tracking-[2px] text-white/50">
                  Administration Portal
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeDrawer}
                aria-label="Close navigation"
                className="grid size-10 shrink-0 place-items-center rounded-md text-white/70 transition hover:bg-ink-2 hover:text-white"
              >
                <X size={20} strokeWidth={1.8} aria-hidden="true" />
              </button>
            </div>

            <div>
              <p className="px-3 pb-2.5 text-[9px] font-bold uppercase tracking-[1.4px] text-white/45">
                Workspace
              </p>

              <AdminNavigation onNavigate={closeDrawer} />
            </div>

            <div className="mt-auto border-t border-ink-3 px-1.75 pt-4.25">
              <p className="text-xs font-semibold">
                {user.firstName} {user.lastName}
              </p>

              <p className="mt-1 truncate text-[10px] text-white/50">
                {user.email}
              </p>
            </div>

            <div className="mt-3">
              <LogoutButton />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}