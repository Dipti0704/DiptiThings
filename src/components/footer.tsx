import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-ink px-6 pb-10 pt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-background/40 sm:px-12">
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-background/10 pt-8">
        <p>
          © {new Date().getFullYear()} {site.name} · Bengaluru, India
        </p>
        <p></p>
      </div>
    </footer>
  );
}
