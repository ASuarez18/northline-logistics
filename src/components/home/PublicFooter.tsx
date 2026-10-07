import Link from "next/link";
import { ChartNoAxesColumnIncreasing } from "lucide-react";

export default function PublicFooter() {
  return (
    <div className="border-t border-white/10 bg-ink text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-[22px] py-10 sm:px-8 md:grid-cols-3 md:items-center lg:px-10">
        <Link
          href="/"
          className="flex w-fit items-center gap-3"
          aria-label="ABC Holding homepage"
        >
          <ChartNoAxesColumnIncreasing
            size={34}
            strokeWidth={4}
            className="shrink-0 text-orange"
            aria-hidden="true"
          />

          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold leading-none tracking-tight">
              ABC Holding
            </span>

            <span className="mt-1.5 text-[8px] font-semibold uppercase tracking-[2.2px] text-white/50">
              Logistics & Operations
            </span>
          </div>
        </Link>

        <p className="text-xs text-white/45 md:text-center">
          Reliable operations. Built to move.
        </p>

        <p className="text-xs text-white/45 md:text-right">
          © {new Date().getFullYear()} ABC Holding
        </p>
      </div>
    </div>
  );
}
