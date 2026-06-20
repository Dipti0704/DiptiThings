import Link from "next/link";
import { site } from "@/lib/site";

const items = [
  { href: "#work", label: "Work" },
  { href: "#interests", label: "Interests" },
  { href: "#stack", label: "Stack" },
  { href: "#connect", label: "Connect" },
];

export function Nav() {
  return (
    <nav className="relative z-10 flex items-center justify-between gap-6 px-6 py-6 sm:px-12 sm:py-8">
      <Link
        href="/"
        className="group flex items-baseline gap-0.5 font-display text-base font-medium tracking-tight text-ink"
      >
        <span className="mr-1.5 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-accent" />
        dipti
        <span className="text-faint">-things</span>
      </Link>

      <div className="hidden items-center gap-7 text-xs font-medium uppercase tracking-[0.18em] text-muted sm:flex">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="transition-colors hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <a
        href={site.links.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
      >
        Resume <span aria-hidden>↗</span>
      </a>
    </nav>
  );
}
