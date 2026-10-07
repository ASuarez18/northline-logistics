import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Check } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="bg-ink text-white">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-[22px] pt-10 pb-16 sm:px-8 sm:pt-14 sm:pb-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-10 lg:pt-10 lg:pb-16">
        <div>
          <p className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[2.2px] text-white/65">
            <span className="h-px w-6 bg-orange" aria-hidden="true" />
            Warehousing & Distribution
          </p>

          <h1 className="max-w-xl font-heading text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[3.75rem]">
            Moving
            <br className="hidden lg:block" /> operations{" "}
            <span className="text-orange">forward.</span>
          </h1>

          <p className="mt-7 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
            Reliable warehousing, distribution, and supply chain operations
            —built to keep your business moving without interruption.
          </p>

          <div className="mt-8 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/login"
              className="inline-flex min-h-11 w-full items-center justify-center gap-3 bg-orange px-6 py-3 text-xs font-bold text-white transition-colors hover:bg-orange-dark sm:w-auto"
            >
              Employee Login
              <ArrowRight size={16} aria-hidden="true" />
            </Link>

            <Link
              href="/#services"
              className="inline-flex min-h-11 items-center gap-3 py-3 text-xs font-bold text-white transition-colors hover:text-orange"
            >
              Explore our operations
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-9 flex flex-col gap-3 border-t border-white/15 pt-5 text-[11px] text-white/55 sm:flex-row sm:gap-7">
            <span className="flex items-center gap-2">
              <Check
                size={13}
                strokeWidth={2}
                className="text-orange"
                aria-hidden="true"
              />
              Precision at every handoff
            </span>

            <span className="flex items-center gap-2">
              <Check
                size={13}
                strokeWidth={2}
                className="text-orange"
                aria-hidden="true"
              />
              Built for reliability
            </span>
          </div>
        </div>

        <div className="relative min-w-0">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=82&w=1400"
              alt="Organized warehouse with shelving and distribution inventory"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 55vw"
              className="object-cover"
            />
          </div>

          <div className="absolute -top-5 -right-5 hidden h-16 w-16 lg:block">
            <div className="absolute top-0 right-0 h-px w-full bg-orange/80" />
            <div className="absolute top-3 right-0 h-px w-full bg-orange/65" />
            <div className="absolute top-6 right-0 h-px w-full bg-orange/50" />
            <div className="absolute top-9 right-0 h-px w-full bg-orange/35" />
            <div className="absolute top-12 right-0 h-px w-full bg-orange/20" />
          </div>

          <div className="absolute right-0 bottom-0 left-0 border-l-2 border-orange bg-white p-4 text-ink shadow-lg sm:right-auto sm:bottom-5 sm:left-[-20px] sm:min-w-60">
            <div className="flex items-center gap-3">
              <Building2
                size={18}
                className="shrink-0 text-orange"
                aria-hidden="true"
              />

              <div>
                <p className="text-xs font-bold">Regional distribution</p>
                <p className="mt-1 text-[10px] text-muted">
                  Built for continuous flow
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
