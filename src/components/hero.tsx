import { site, stats } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative px-6 pt-6 pb-24 sm:px-12 sm:pt-10 sm:pb-32">
      <div
        className="blob blob-peach -right-32 top-0 h-[520px] w-[520px]"
        aria-hidden
      />
      <div
        className="blob blob-blue -left-32 top-72 h-[440px] w-[440px]"
        aria-hidden
      />

      <div className="relative z-10 fade-up">
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {site.availability}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden
            >
              <path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            {site.location}
          </span>
        </div>

        <h1 className="mt-8 font-display text-6xl font-bold leading-[0.95] tracking-[-0.04em] text-ink sm:text-[7.5rem]">
          {site.name.split(" ")[0]}
          <br />
          {site.name.split(" ")[1]}
          <span className="ml-1 inline-block h-3 w-3 translate-y-[-0.05em] bg-accent sm:h-5 sm:w-5" />
        </h1>

        <div className="mt-10 grid gap-10 sm:mt-14 sm:grid-cols-[1.05fr_1fr] sm:items-end">
          <p className="max-w-md text-base leading-relaxed text-muted sm:text-lg">
            {site.tagline}
          </p>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
              >
                View projects <span aria-hidden>↓</span>
              </a>
              <a
                href="#connect"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink/40"
              >
                Say hello
              </a>
            </div>

            <dl className="grid grid-cols-3 gap-6 border-t border-border pt-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-faint">
                    {s.label}
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
