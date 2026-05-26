import { projects } from "@/lib/site";
import { ProjectCard } from "@/components/project-card";

const featuredSlugs = ["talentsearch-ai", "retail-data-platform", "agentic-ai-dev"];

export function Shipped() {
  const featured = featuredSlugs
    .map((slug) => projects.find((p) => p.slug === slug)!)
    .filter(Boolean);
  const rest = projects.filter((p) => !featuredSlugs.includes(p.slug));

  return (
    <section
      id="work"
      className="relative scroll-mt-24 border-t border-border bg-background px-6 py-24 sm:px-12 sm:py-32"
    >
      <SectionLabel>+ Selected work</SectionLabel>

      <div className="mt-6 grid gap-10 sm:grid-cols-[1.5fr_1fr] sm:items-end">
        <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.03em] text-ink sm:text-7xl">
          Things I&apos;ve <span className="text-accent">shipped.</span>
        </h2>
        <p className="max-w-md text-base leading-relaxed text-muted">
          {projects.length} products from idea to App Store and production —
          each solving a real problem in finance, wellness, product
          intelligence, or RWA.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-3 sm:grid-rows-[auto_auto_auto]">
        <div className="sm:col-span-2 sm:row-span-2">
          <ProjectCard project={featured[0]} size="large" />
        </div>
        <div className="flex flex-col gap-5 sm:col-span-1 sm:row-span-2">
          <ProjectCard project={featured[1]} />
          <ProjectCard project={featured[2]} />
        </div>

        {rest.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
      {children}
    </p>
  );
}
