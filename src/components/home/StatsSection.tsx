const statistics = [
  {
    value: "40+",
    label: "Team members",
  },
  {
    value: "2",
    label: "Operating locations",
  },
  {
    value: "8–5",
    label: "Daily operations",
  },
  {
    value: "1",
    label: "Connected logistics team",
  },
];

export default function StatsSection() {
  return (
    <div className="border-b border-border bg-white">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 px-5 sm:px-8 lg:grid-cols-4 lg:px-10">
        {statistics.map((stat, index) => (
          <div
            key={stat.label}
            className={[
              "relative py-7 sm:px-6 sm:py-8 lg:px-8",
              index % 2 !== 0 ? "border-l border-border" : "",
              index >= 2 ? "border-t border-border lg:border-t-0" : "",
              index > 0 ? "lg:border-l lg:border-border" : "",
            ].join(" ")}
          >
            <p className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {stat.value}
            </p>

            <p className="mt-2 text-[11px] text-muted sm:text-xs">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
