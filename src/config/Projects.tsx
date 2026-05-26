import PostgreSQL from '@/components/technologies/PostgreSQL';
import Python from '@/components/technologies/Python';
import { Project } from '@/types/project';

export const projects: Project[] = [
  {
    title: 'TalentSearch AI',
    description:
      'AI-powered hiring assistant using RAG and LLM agents for semantic resume retrieval, ranking, and analysis. Employs Pinecone vector search with intelligent workflows, lowering LLM usage and response latency.',
    image: '/project/talentsearch.png',
    link: 'https://github.com/Dipti0704',
    technologies: [
      { name: 'Python', icon: <Python key="python" /> },
      { name: 'OpenAI', icon: <Python key="openai" /> },
      { name: 'Pinecone', icon: <PostgreSQL key="pinecone" /> },
      { name: 'LangChain', icon: <Python key="langchain" /> },
      { name: 'Streamlit', icon: <Python key="streamlit" /> },
    ],
    github: 'https://github.com/Dipti0704',
    live: 'https://github.com/Dipti0704',
    details: true,
    projectDetailsPageSlug: '/projects/talentsearch-ai',
    isWorking: true,
  },
  {
    title: 'Retail Data Platform',
    description:
      '3-layer data platform (Raw, Staging, Analytics) on HDFS using Hive and PySpark, processing multi-source retail datasets (orders, payments, inventory, clickstream). Optimized with PySpark transformations and star schema data modeling.',
    image: '/project/retail-platform.png',
    link: 'https://github.com/Dipti0704',
    technologies: [
      { name: 'PySpark', icon: <Python key="pyspark" /> },
      { name: 'Hive', icon: <PostgreSQL key="hive" /> },
      { name: 'HDFS', icon: <PostgreSQL key="hdfs" /> },
      { name: 'SQL', icon: <PostgreSQL key="sql" /> },
    ],
    github: 'https://github.com/Dipti0704',
    live: 'https://github.com/Dipti0704',
    details: true,
    projectDetailsPageSlug: '/projects/retail-data-platform',
    isWorking: true,
  },
  {
    title: 'Agentic Workflows',
    description:
      'Agentic multi-agent systems designed using LangGraph, UiPath, and Maestro for intelligent task orchestration with human-in-the-loop systems. Features automated BRD-to-Jira priority pipelines and transcription processing.',
    image: '/project/agentic-workflows.png',
    link: 'https://github.com/Dipti0704',
    technologies: [
      { name: 'LangGraph', icon: <Python key="langgraph" /> },
      { name: 'UiPath', icon: <Python key="uipath" /> },
      { name: 'Maestro', icon: <Python key="maestro" /> },
      { name: 'n8n', icon: <Python key="n8n" /> },
    ],
    github: 'https://github.com/Dipti0704',
    live: 'https://github.com/Dipti0704',
    details: true,
    projectDetailsPageSlug: '/projects/agentic-workflows',
    isWorking: true,
  },
];
