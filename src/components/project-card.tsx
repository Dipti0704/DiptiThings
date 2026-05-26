import { Project } from "@/lib/site";

export function ProjectCard({
  project,
  size = "small",
}: {
  project: Project;
  size?: "small" | "large";
}) {
  const isLarge = size === "large";
  const primary = project.live ?? project.appStore ?? project.github;
  const cardClassName =
    "group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.25)]";

  const inner = (
    <>
      {isLarge ? (
        <div
          className="relative h-72 overflow-hidden sm:h-96"
          style={{
            background: `linear-gradient(135deg, ${project.gradient[0]} 0%, ${project.gradient[1]} 100%)`,
          }}
        >
          <div className="dot-pattern absolute inset-0 text-ink/[0.06]" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        </div>
      ) : null}

      <div className={`flex flex-1 flex-col p-6 ${isLarge ? "sm:p-7" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
            {project.title}
            {project.status ? (
              <span className="ml-2 inline-flex translate-y-[-2px] rounded-full bg-accent/15 px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wider text-accent">
                {project.status}
              </span>
            ) : null}
          </h3>
          {project.stars ? (
            <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2l2.93 6.93L22 10l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.87 2 10l7.07-1.07z" />
              </svg>
              {project.stars}
            </span>
          ) : null}
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-border bg-background/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted">
          <div className="flex items-center gap-4">
            {project.live ? (
              <span className="inline-flex items-center gap-1 transition-colors group-hover:text-accent">
                <LinkIcon /> Live
              </span>
            ) : null}
            {project.appStore ? (
              <span className="inline-flex items-center gap-1 transition-colors group-hover:text-accent">
                <AppleIcon /> App Store
              </span>
            ) : null}
            {project.github ? (
              <span className="inline-flex items-center gap-1 transition-colors group-hover:text-foreground">
                <CodeIcon /> Code
              </span>
            ) : null}
          </div>
          {primary ? (
            <span
              aria-hidden
              className="text-faint transition-all group-hover:translate-x-0.5 group-hover:text-ink"
            >
              ↗
            </span>
          ) : null}
        </div>
      </div>
    </>
  );

  if (primary) {
    return (
      <a
        href={primary}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClassName}
      >
        {inner}
      </a>
    );
  }

  return <article className={cardClassName}>{inner}</article>;
}

function LinkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M9 17H7A5 5 0 0 1 7 7h2" />
      <path d="M15 7h2a5 5 0 0 1 0 10h-2" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4" />
      <path d="M9 9l-3 3 3 3" />
      <path d="M15 9l3 3-3 3" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}
