import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Package,
  Truck,
  type LucideIcon,
} from "lucide-react";

type Service = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const services: Service[] = [
  {
    number: "01",
    title: "Warehousing",
    description:
      "Secure, organized storage engineered for accuracy, visibility, and efficient throughput.",
    icon: Building2,
  },
  {
    number: "02",
    title: "Distribution",
    description:
      "Reliable regional and national movement with disciplined scheduling and precise handoffs.",
    icon: Truck,
  },
  {
    number: "03",
    title: "Supply Chain Operations",
    description:
      "End-to-end operational support that creates resilience across your entire network.",
    icon: Package,
  },
];

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;

  return (
    <article className="group flex flex-col border border-border bg-white p-6 sm:p-7 lg:min-h-72 lg:p-8">
      <div className="flex items-start justify-between">
        <span className="flex size-11 items-center justify-center bg-ink text-white">
          <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
        </span>

        <span className="text-[10px] font-semibold text-muted/70">
          {service.number}
        </span>
      </div>

      <div className="mt-10">
        <h3 className="font-heading text-xl font-semibold tracking-tight text-ink">
          {service.title}
        </h3>

        <p className="mt-4 max-w-sm text-sm leading-7 text-muted">
          {service.description}
        </p>
      </div>

      <Link
        href="/#about"
        aria-label={`Learn more about ${service.title}`}
        className="mt-auto inline-flex w-fit items-center pt-8 text-orange transition-transform group-hover:translate-x-1"
      >
        <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
      </Link>
    </article>
  );
}

export default function ServicesSection() {
  return (
    <div className="bg-cream py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-[22px] sm:px-8 lg:px-10">
        <div className="mb-10 grid gap-6 lg:mb-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[2.2px] text-orange">
              What we do
            </p>

            <h2 className="max-w-2xl font-heading text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-4xl lg:text-[2.75rem]">
              Infrastructure that keeps
              <br className="hidden sm:block" /> commerce moving.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-muted lg:justify-self-end">
            Northline connects people, facilities, and technology into
            dependable logistics operations that scale with your business.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
          {services.map((service) => (
            <ServiceCard key={service.number} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}