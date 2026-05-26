import Python from '@/components/technologies/Python';

export interface Technology {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export interface Experience {
  company: string;
  position: string;
  location: string;
  image: string;
  description: string[];
  startDate: string;
  endDate: string;
  website?: string;
  x?: string;
  linkedin?: string;
  github?: string;
  technologies: Technology[];
  isCurrent: boolean;
  isBlur?: boolean;
}

export const experiences: Experience[] = [
  {
    isCurrent: false,
    company: 'WNS-VURAM',
    position: 'AI Research Developer Intern',
    location: 'Bengaluru, India',
    image: '/assets/logo.png',
    description: [
      'Built an automated BRD-to-Jira pipeline with priority extraction, parsing requirement documents to generate structured projects (epics, user stories, tasks) with assigned owners and priorities.',
      'Conducted in-depth research and feasibility analysis on Firecrawl (FIRE-1 agent) as an alternative to traditional RPA tools, evaluating cost, scalability, and end-to-end automation capabilities.',
      'Designed and implemented agentic multi-agent workflows using LangGraph, UiPath, and Maestro, enabling intelligent task orchestration with minimal human intervention (human-in-the-loop systems).',
      'Developed a HIPAA-compliant medical insurance AI system that analyzes doctor–patient transcripts to recommend applicable insurance codes and generate structured medical reports, streamlining medical coding workflows.',
    ],
    startDate: 'March 2025',
    endDate: 'July 2025',
    website: 'https://www.vuram.com/',
    linkedin: 'https://www.linkedin.com/company/vuram/',
    technologies: [
      { name: 'Python', href: 'https://python.org/', icon: <Python /> },
      { name: 'LangGraph', href: 'https://github.com/langchain-ai/langgraph', icon: <Python /> },
      { name: 'UiPath', href: 'https://www.uipath.com/', icon: <Python /> },
      { name: 'Firecrawl', href: 'https://www.firecrawl.dev/', icon: <Python /> },
    ],
  },
];
