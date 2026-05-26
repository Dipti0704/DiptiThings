import { about } from './About';
import { heroConfig } from './Hero';

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

export const siteConfig = {
  name: heroConfig.name,
  title: `${heroConfig.name} — Portfolio`,
  description:
    'AI/ML & Agentic AI Engineer specializing in autonomous multi-agent systems, RAG assistants, and production-grade retail data platforms.',
  url: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  ogImage: '/meta/opengraph-image.png',
  author: {
    name: about.name,
    twitter: '',
    github: 'Dipti0704',
    email: 'dipti820h@gmail.com',
  },
  keywords: [
    'portfolio',
    'AI',
    'ML',
    'automation',
    'agentic',
    'LangGraph',
    'Next.js',
    'Bengaluru',
    'PySpark',
    'Hive',
    heroConfig.name.toLowerCase(),
  ],
};

export const pageMetadata: Record<string, PageMeta> = {
  '/': {
    title: `${heroConfig.name} — ${heroConfig.title}`,
    description: about.description,
    ogImage: '/meta/opengraph-image.png',
    twitterCard: 'summary_large_image',
  },
  '/resume': {
    title: 'Resume — Dipti Hatwar',
    description:
      'AI/ML & Agentic AI Engineer resume: LangGraph agent workflows, PySpark data platform, RAG hiring assistant, and intern experience from Bengaluru.',
    twitterCard: 'summary_large_image',
  },
  '/contact': {
    title: 'Contact — Get in Touch',
    description:
      "Get in touch for collaborations on AI, agentic systems, big data, and automation ideas. I'd love to hear from you!",
    twitterCard: 'summary',
  },
  '/work-experience': {
    title: 'Experience — Professional Journey',
    description:
      'AI/ML engineering, Agentic workflows, Big Data Retail Platforms, and Intern experience at WNS-VURAM.',
    twitterCard: 'summary_large_image',
  },
  '/projects': {
    title: 'Projects — Portfolio',
    description:
      'TalentSearch AI, Production-Grade Retail Data Platform, Agentic Workflows, and Fraud Detection.',
    twitterCard: 'summary_large_image',
  },
};

export function getPageMetadata(pathname: string): PageMeta {
  return pageMetadata[pathname] || pageMetadata['/'];
}

export function generateMetadata(pathname: string) {
  const pageMeta = getPageMetadata(pathname);

  return {
    metadataBase: new URL(siteConfig.url),
    title: pageMeta.title,
    description: pageMeta.description,
    keywords: pageMeta.keywords?.join(', ') ?? siteConfig.keywords.join(', '),
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    openGraph: {
      type: 'website',
      url: `${siteConfig.url}${pathname}`,
      title: pageMeta.title,
      description: pageMeta.description,
      siteName: siteConfig.title,
      images: [
        {
          url: pageMeta.ogImage || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: pageMeta.title,
        },
      ],
    },
    twitter: {
      card: pageMeta.twitterCard || 'summary_large_image',
      title: pageMeta.title,
      description: pageMeta.description,
      creator: siteConfig.author.twitter,
      images: [pageMeta.ogImage || siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${siteConfig.url}${pathname}`,
    },
  };
}
