import AWS from '@/components/technologies/AWS';
import ExpressJs from '@/components/technologies/ExpressJs';
import NextJs from '@/components/technologies/NextJs';
import NodeJs from '@/components/technologies/NodeJs';
import PostgreSQL from '@/components/technologies/PostgreSQL';
import Python from '@/components/technologies/Python';
import ReactIcon from '@/components/technologies/ReactIcon';
import TailwindCss from '@/components/technologies/TailwindCss';
import TypeScript from '@/components/technologies/TypeScript';
import Vercel from '@/components/technologies/Vercel';

export const mySkills = [
  <Python key="python" />,
  <TypeScript key="typescript" />,
  <ReactIcon key="react" />,
  <NextJs key="nextjs" />,
  <NodeJs key="nodejs" />,
  <ExpressJs key="express" />,
  <PostgreSQL key="postgresql" />,
  <TailwindCss key="tailwind" />,
  <Vercel key="vercel" />,
  <AWS key="aws" />,
];

export const about = {
  name: 'Dipti Hatwar',
  description: `AI/ML and Agentic AI Engineer with a strong foundation in building autonomous workflows, LLM-powered RAG systems, automation, and production-grade retail data platforms. Experienced in Python, LangGraph, PySpark, Hive, and enterprise automations using n8n and UiPath.`,
};

export const skillGroups = [
  {
    label: 'Languages',
    items: [
      'Python',
      'Java',
      'JavaScript',
      'SQL',
      'MongoDB',
      'HTML5',
      'CSS',
    ],
  },
  {
    label: 'AI / ML & Automation',
    items: [
      'Agentic AI',
      'LangGraph',
      'n8n',
      'RAG pipelines',
      'Prompt engineering',
      'LangChain',
      'UiPath RPA',
      'Maestro',
      'Multi-agent systems',
    ],
  },
  {
    label: 'Frameworks & Platforms',
    items: [
      'PySpark',
      'Hive',
      'HDFS',
      'React.js',
      'Node.js',
      'Express.js',
      'Next.js',
      'Git/GitHub',
      'REST APIs',
      'Streamlit',
      'Docker',
      'Postman',
      'Jira',
    ],
  },
  {
    label: 'Domains & Leadership',
    items: [
      'Placement Cell Secretary leadership',
      'Big Data Retail Platforms',
      'AI Hiring Assistants',
      'Automated Ticket Pipelines',
      'HIPAA Medical Coding Systems',
      'Process Automation',
    ],
  },
];

export const highlights = [
  'Secretary of Placement Cell at Scaler School of Technology, managing student profiles and collaborating with industry partners.',
  'Designed and implemented agentic multi-agent workflows using LangGraph, UiPath, and Maestro with human-in-the-loop orchestrations.',
  'Built a HIPAA-compliant medical insurance AI analyzing doctor-patient transcripts for structured insurance coding and reports.',
  'Developed a 3-layer big data retail platform on HDFS using Hive and PySpark for CLV and query optimization.',
];
