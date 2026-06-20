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
    slug: "ai-persona",
    title: "Dipti's AI Persona",
    subtitle: "AI voice & text recruiter assistant",
    description:
      "Built and deployed an AI-powered digital persona (Dipti’s AI Persona) enabling recruiters to interact with candidate info via text and voice. Features a RAG pipeline for grounded resume retrieval, agentic tool-calling, intent routing, and live Twilio/Vapi voice integration.",
    live: "https://dipti-s-ai-persona.onrender.com/",
    github: "https://github.com/Dipti0704/Dipti-s-AI-Persona",
    tags: ["React.js", "FastAPI", "OpenAI API", "RAG", "Vapi", "Twilio", "Cal.com"],
    gradient: ["#f4d6c6", "#e8b89c"],
  },
  {
    slug: "talentsearch-ai",
    title: "TalentSearch AI",
    subtitle: "AI hiring assistant & RAG agent",
    description:
      "An AI-powered hiring assistant using RAG and LLM agents for semantic resume retrieval, ranking, and analysis. Built on a Pinecone-based vector search pipeline with agentic workflows, reducing LLM costs and latency.",
      live: "https://talentsearchai.onrender.com/",
      github: "https://github.com/Dipti0704/TalentSearchAI",
    tags: ["Python", "OpenAI", "Pinecone", "LangChain", "Streamlit", "RAG"],
    featured: true,
  
    gradient: ["#d4c4e8", "#c9a8df"],
  },
  {
    slug: "retail-data-platform",
    title: "Retail Data Platform",
    subtitle: "Production-grade HDFS data platform",
    description:
      "Designed and built a 3-layer data platform (Raw, Staging, Analytics) on HDFS using Hive and PySpark, enabling centralized processing of multi-source retail datasets. Optimizes data transformation and query performance with star schema.",
    github: "https://drive.google.com/drive/folders/1i86tLr4-5s_hUYVuffBI2Nr_9UdeNHhf",
    tags: ["PySpark", "Hive", "HDFS", "SQL", "Big Data", "Data Eng"],
    featured: true,
   
    gradient: ["#cdd9e5", "#e3d4c2"],
  },
  {
    slug: "agentic-ai-business-system",
    title: "Agentic AI Business System",
    subtitle: "Local multi-agent automation platform",
    description:
      "A production-ready Multi-Agent AI Platform powered by Ollama (Local LLM) that helps businesses automate Sales, Marketing, Copywriting, and Analytics. Integrates a user UI that routes queries to domain-specific agents for intelligent, structured output.",
    github: "https://github.com/Dipti0704/Agentic-AI-Business-System",
    tags: ["Python", "Flask", "HTML/CSS", "JavaScript", "Ollama", "Agents"],
    featured: true,
    gradient: ["#c8e0d2", "#a8cdb6"],
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

