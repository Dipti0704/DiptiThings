import { projects } from "@/lib/site";
import { ProjectCard } from "@/components/project-card";

export function Shipped() {
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
          {projects.length} Projects I&apos;ve built and shipped as part of my learning journey—exploring interesting ideas, solving practical problems, and turning curiosity into working products.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
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
