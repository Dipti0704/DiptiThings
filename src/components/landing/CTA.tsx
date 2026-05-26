'use client';

import { ctaConfig } from '@/config/CTA';
import { Link } from 'next-view-transitions';
import Image from 'next/image';

import Container from '../common/Container';

export default function CTA() {
  return (
    <Container className="mt-20 rounded-md border border-dashed border-black/20 py-8 dark:border-white/10">
      <div className="flex w-full flex-col items-center justify-between gap-6 px-6 sm:flex-row sm:px-12">
        <p className="text-center text-base opacity-80 sm:text-left md:text-lg">
          {ctaConfig.preText}
        </p>
        <Link
          href={ctaConfig.href}
          className="group inline-flex items-center gap-2 rounded-md border border-dashed border-black/20 bg-black/5 px-4 py-2 text-sm font-semibold shadow-sm transition-all hover:gap-3 dark:border-white/30 dark:bg-white/10"
        >
          <Image
            alt={ctaConfig.profileAlt}
            width={24}
            height={24}
            className="size-6 rounded-full object-cover"
            src={ctaConfig.profileImage}
          />
          {ctaConfig.linkText}
        </Link>
      </div>
    </Container>
  );
}
