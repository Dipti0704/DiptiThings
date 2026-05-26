import { toolbox } from "@/lib/site";

export function Toolbox() {
  return (
    <section
      id="stack"
      className="relative scroll-mt-24 overflow-hidden border-t border-border px-6 py-24 sm:px-12 sm:py-32"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        + Stack &amp; tooling
      </p>

      <div className="mt-6 grid gap-10 sm:grid-cols-[1.5fr_1fr] sm:items-end">
        <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.03em] text-ink sm:text-7xl">
          The toolbox.
        </h2>
        <p className="max-w-md text-base leading-relaxed text-muted">
          Languages, frameworks, and infra I reach for daily — picked for
          speed of shipping, not for the brochure.
        </p>
      </div>

      <div className="mt-14 -mx-6 space-y-4 overflow-hidden sm:-mx-12">
        <MarqueeRow items={toolbox.rowA} direction="left" filledEvery={2} />
        <MarqueeRow items={toolbox.rowB} direction="right" filledEvery={3} />
      </div>
    </section>
  );
}

function MarqueeRow({
  items,
  direction,
  filledEvery,
}: {
  items: readonly string[];
  direction: "left" | "right";
  filledEvery: number;
}) {
  const doubled = [...items, ...items, ...items, ...items];

  return (
    <div className="relative">
      <div
        className={`marquee-track ${
          direction === "left" ? "marquee-left" : "marquee-right"
        }`}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-8 px-6 font-display text-6xl font-bold tracking-[-0.03em] sm:text-8xl"
          >
            <span
              className={
                i % filledEvery === 0 ? "text-ink" : "text-outline"
              }
            >
              {item}
            </span>
            <Diamond />
          </span>
        ))}
      </div>
    </div>
  );
}

function Diamond() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="shrink-0 text-accent"
      aria-hidden
    >
      <path d="M12 2l5 10-5 10-5-10z" />
    </svg>
  );
}
