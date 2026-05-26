import Link from 'next/link';
import { ReactNode } from 'react';

export function SimplePage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <Link
        href="/"
        className="text-muted hover:text-foreground text-sm transition-colors"
      >
        ← Home
      </Link>
      <h1 className="text-foreground mt-10 font-serif text-3xl font-medium tracking-tight">
        {title}
      </h1>
      {description ? (
        <p className="text-muted mt-4 max-w-xl text-base leading-relaxed">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </>
  );
}
