import Github from '@/components/svgs/Github';
import Mail from '@/components/svgs/Mail';
import LinkedIn from '@/components/svgs/LinkedIn';
import NextJs from '@/components/technologies/NextJs';
import NodeJs from '@/components/technologies/NodeJs';
import PostgreSQL from '@/components/technologies/PostgreSQL';
import Python from '@/components/technologies/Python';
import ReactIcon from '@/components/technologies/ReactIcon';
import TypeScript from '@/components/technologies/TypeScript';

export const skillComponents = {
  TypeScript,
  ReactIcon,
  NextJs,
  NodeJs,
  PostgreSQL,
  Python,
};

export const heroConfig = {
  name: 'Dipti Hatwar',
  title: 'AI/ML & Agentic AI Engineer · Automations & Data Engineering',
  location: 'Bengaluru, India',
  avatar: '',
  tagline:
    'AI/ML & Agentic AI Engineer specializing in building autonomous multi-agent systems, AI-powered RAG assistants, and production-grade retail data platforms — focused on AI/ML, Automation, and Data Engineering.',
  skills: [
    {
      name: 'Python',
      href: 'https://www.python.org/',
      component: 'Python',
    },
    {
      name: 'TypeScript',
      href: 'https://www.typescriptlang.org/',
      component: 'TypeScript',
    },
    {
      name: 'React',
      href: 'https://react.dev/',
      component: 'ReactIcon',
    },
    {
      name: 'Next.js',
      href: 'https://nextjs.org/',
      component: 'NextJs',
    },
    {
      name: 'PostgreSQL',
      href: 'https://www.postgresql.org/',
      component: 'PostgreSQL',
    },
  ],
  description: {
    template:
      'I build at the intersection of <b>data</b>, <b>AI agents</b>, and <b>orchestration</b> — from production-grade HDFS data platforms to complex multi-agent LangGraph workflows and custom RAG applications.',
  },
  buttons: [
    {
      variant: 'default' as const,
      text: 'View Projects',
      href: '/projects',
      icon: 'CV',
    },
    {
      variant: 'outline' as const,
      text: 'Resume',
      href: '/resume',
      icon: 'CV',
    },
  ],
};

export const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/dipti-hatwar-024027289/',
    icon: <LinkedIn />,
  },
  {
    name: 'Github',
    href: 'https://github.com/Dipti0704',
    icon: <Github />,
  },
  {
    name: 'Email',
    href: 'mailto:dipti820h@gmail.com',
    icon: <Mail />,
  },
];
