"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, ChartNoAxesColumnIncreasing } from "lucide-react";

const navigation = [
  { label: "Company", href: "/#company" },
  { label: "Operations", href: "/#services" },
  { label: "About", href: "/#about" },
];

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-ink text-white">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="flex w-fit items-center gap-3"
          aria-label="ABC Holding homepage"
        >
          <ChartNoAxesColumnIncreasing
            size={38}
            strokeWidth={4}
            className="shrink-0 text-orange"
            aria-hidden="true"
          />

          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold leading-none tracking-tight text-white">
              ABC Holding
            </span>

            <span className="mt-1.5 text-[8px] font-semibold uppercase tracking-[2.2px] text-white/50">
              Logistics & Operations
            </span>
          </div>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-10 lg:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-medium text-white/70 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden min-h-10 items-center gap-2 bg-orange px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-orange-dark sm:inline-flex"
          >
            Employee Login
            <ArrowRight size={15} aria-hidden="true" />
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="public-mobile-navigation"
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex size-10 items-center justify-center border border-white/20 text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            {menuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="public-mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-white/10 px-5 py-4 sm:px-8 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/10 py-3 text-sm font-medium text-white/75 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-4 bg-orange px-4 py-3 text-center text-sm font-bold text-white sm:hidden"
            >
              Employee Login
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
