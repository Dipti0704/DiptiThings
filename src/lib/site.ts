export const site = {
  name: "Dipti Hatwar",
  handle: "Dipti0704",
  xHandle: "",
  location: "Bengaluru, India",
  role: "AI/ML & Agentic AI Engineer · Automations & Data Engineering",
  headline: "I build autonomous workflows and data platforms.",
  tagline:
    "I build agentic multi-agent systems, AI-powered RAG assistants, and production-grade retail data platforms — focused on AI/ML, Automation, and Data Engineering.",
  bio: "AI/ML and Agentic AI Engineer passionate about building autonomous workflows, LLM-powered RAG pipelines, automation, and scalable data platforms. Experienced in LangGraph and Spark & Hive.",
  availability: "Open to collaborate · 2026",
  links: {
    github: "https://github.com/Dipti0704",
    linkedin: "https://www.linkedin.com/in/dipti-hatwar-024027289/",
    email: "dipti820h@gmail.com",
    resume: "/Dipti_Hatwar_Resume.pdf",
  },
  avatar: "",
} as const;

export const stats = [
  { value: "1+", label: "Years in AI/ML" },
  { value: "5+", label: "AI & Data Systems" },
  { value: "7.9", label: "BITS Pilani CGPA" },
];

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  live?: string;
  github?: string;
  appStore?: string;
  tags: string[];
  status?: string;
  featured?: boolean;
  stars?: number;
  gradient: [string, string];
};

export const projects: Project[] = [
  {
    slug: "talentsearch-ai",
    title: "TalentSearch AI",
    subtitle: "AI hiring assistant & RAG agent",
    description:
      "An AI-powered hiring assistant using RAG and LLM agents for semantic resume retrieval, ranking, and analysis. Built on a Pinecone-based vector search pipeline with agentic workflows, reducing LLM costs and latency.",
    github: "https://github.com/Dipti0704",
    tags: ["Python", "OpenAI", "Pinecone", "LangChain", "Streamlit", "RAG"],
    featured: true,
    stars: 1,
    gradient: ["#d4c4e8", "#c9a8df"],
  },
  {
    slug: "retail-data-platform",
    title: "Retail Data Platform",
    subtitle: "Production-grade HDFS data platform",
    description:
      "Designed and built a 3-layer data platform (Raw, Staging, Analytics) on HDFS using Hive and PySpark, enabling centralized processing of multi-source retail datasets. Optimizes data transformation and query performance with star schema.",
    github: "https://github.com/Dipti0704",
    tags: ["PySpark", "Hive", "HDFS", "SQL", "Big Data", "Data Eng"],
    featured: true,
    stars: 1,
    gradient: ["#cdd9e5", "#e3d4c2"],
  },
  {
    slug: "agentic-ai-dev",
    title: "Agentic Workflows",
    subtitle: "LangGraph & n8n business automations",
    description:
      "A suite of autonomous multi-agent systems designed using LangGraph, n8n, UiPath, and Maestro for intelligent task orchestration with human-in-the-loop systems. Streamlines complex processes and RPA.",
    github: "https://github.com/Dipti0704",
    tags: ["LangGraph", "n8n", "UiPath", "Maestro", "Agents", "RPA"],
    featured: true,
    gradient: ["#c8e0d2", "#a8cdb6"],
  },
  {
    slug: "fraud-detection",
    title: "Fraud Detection System",
    subtitle: "AI/ML classification & security engine",
    description:
      "An end-to-end Machine Learning system developed to analyze transactions and detect fraudulent activities in real-time, utilizing advanced classification models and robust feature engineering.",
    github: "https://github.com/Dipti0704",
    tags: ["Python", "ML", "Pandas", "Scikit-Learn", "Security"],
    gradient: ["#f4d6c6", "#e8b89c"],
  },
];

export const obsessions = [
  {
    title: "Agentic AI & Autonomy",
    description:
      "Building multi-agent systems, autonomous LangGraph workflows, and complex task orchestrations with human-in-the-loop controls.",
    active: true,
  },
  {
    title: "Data Engineering",
    description:
      "Architecting large-scale pipelines, 3-layer data lakes, and optimizing Spark & Hive queries on HDFS for analytics readiness.",
  },
  {
    title: "RAG & Semantic Search",
    description:
      "Designing high-accuracy vector search pipelines and cost-efficient intelligent document retrievers using Pinecone and LangChain.",
  },
  {
    title: "Automations & RPA",
    description:
      "Streamlining enterprise processes, automated Jira ticket pipelines, and orchestrating workflows with n8n and UiPath.",
  },
  {
    title: "Student Leadership",
    description:
      "Coordinating placement cell activities at Scaler, collaborating with industry recruiters, and driving smooth placement processes.",
  },
];

export const toolbox = {
  rowA: [
    "Python",
    "Java",
    "JavaScript",
    "SQL",
    "MongoDB",
    "LangGraph",
    "n8n",
  ],
  rowB: [
    "PySpark",
    "Hive",
    "HDFS",
    "LangChain",
    "OpenAI",
    "Pinecone",
    "React",
    "Node.js",
    "Express",
    "Streamlit",
  ],
};

