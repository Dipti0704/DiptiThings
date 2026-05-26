import { obsessions } from "@/lib/site";

export function Obsessions() {
  return (
    <section
      id="interests"
      className="relative scroll-mt-24 border-t border-border px-6 py-24 sm:px-12 sm:py-32"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        + What I&apos;m into
      </p>

      <div className="mt-6 grid gap-10 sm:grid-cols-[1.5fr_1fr] sm:items-end">
        <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.03em] text-ink sm:text-7xl">
          Obsessions.
        </h2>
        <p className="max-w-md text-base leading-relaxed text-muted">
          The spaces I think about most days — where I&apos;m placing bets,
          writing code, and looking for collaborators.
        </p>
      </div>

      <ul className="mt-14 grid gap-4 sm:grid-cols-3">
        {obsessions.map((item, i) => (
          <li
            key={item.title}
            className="group relative rounded-3xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs text-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`h-2 w-2 rounded-full ${
                  "active" in item && item.active
                    ? "bg-accent"
                    : "bg-border"
                }`}
                aria-hidden
              />
            </div>
            <h3 className="mt-8 font-display text-xl font-bold tracking-tight text-ink">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
