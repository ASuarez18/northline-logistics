import Image from "next/image";
import { Clock3, ShieldCheck } from "lucide-react";

const principles = [
  {
    title: "Safety first",
    description: "Every facility. Every shift.",
    icon: ShieldCheck,
  },
  {
    title: "Always on time",
    description: "Precise, dependable execution.",
    icon: Clock3,
  },
];

export default function AboutSection() {
  return (
    <div className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-[22px] sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-20 lg:px-10">
        <div className="relative">
          <div className="relative z-10 aspect-[4/3] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1586528116022-aeda1613c63d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
              alt="Warehouse operations and organized logistics infrastructure"
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div
            className="absolute -right-4 -bottom-4 hidden size-24 bg-orange sm:block"
            aria-hidden="true"
          />

          <div
            className="absolute -right-7 -bottom-7 hidden size-20 border-r border-b border-orange/40 lg:block"
            aria-hidden="true"
          />
        </div>

        <div>
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[2.2px] text-orange">
            The ABC Holding standard
          </p>

          <h2 className="max-w-xl font-heading text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-4xl lg:text-[2.75rem]">
            Operational discipline.
            <br />
            Human expertise.
          </h2>

          <p className="mt-7 max-w-xl text-sm leading-7 text-muted">
            Great logistics starts with well-run facilities and dedicated
            teams. At ABC Holding, we focus on the details that make every
            operation more dependable, from daily coordination to the movement
            of goods.
          </p>

          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            Our approach combines clear processes, accountable execution, and a
            commitment to continuous improvement.
          </p>

          <div className="mt-8 grid gap-6 border-t border-border pt-7 sm:grid-cols-2">
            {principles.map((principle) => {
              const Icon = principle.icon;

              return (
                <div
                  key={principle.title}
                  className="flex items-start gap-3"
                >
                  <Icon
                    size={17}
                    strokeWidth={1.8}
                    className="mt-0.5 shrink-0 text-orange"
                    aria-hidden="true"
                  />

                  <div>
                    <h3 className="font-heading text-xs font-bold text-ink">
                      {principle.title}
                    </h3>

                    <p className="mt-1 text-[11px] leading-5 text-muted">
                      {principle.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}