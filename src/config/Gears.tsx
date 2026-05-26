import Headphones from '@/components/svgs/devices/Headphones';
import Keyboard from '@/components/svgs/devices/Keyboard';
import Laptop from '@/components/svgs/devices/Laptop';
import Monitor from '@/components/svgs/devices/Monitor';
import Mouse from '@/components/svgs/devices/Mouse';
import Phone from '@/components/svgs/devices/Phone';

export const devices = [
  {
    name: 'MacBook (primary dev machine)',
    icon: <Laptop className="size-4" />,
  },
  {
    name: 'External monitor for trading dashboards',
    icon: <Monitor className="size-4" />,
  },
  {
    name: 'Mechanical keyboard',
    icon: <Keyboard className="size-4" />,
  },
  {
    name: 'Wireless mouse',
    icon: <Mouse className="size-4" />,
  },
  {
    name: 'iPhone — iOS dev & App Store testing',
    icon: <Phone className="size-4" />,
  },
  {
    name: 'Headphones for focus sessions',
    icon: <Headphones className="size-4" />,
  },
];

export const devStack = [
  { name: 'Python', href: 'https://www.python.org/' },
  { name: 'TypeScript', href: 'https://www.typescriptlang.org/' },
  { name: 'Swift', href: 'https://www.swift.org/' },
  { name: 'LangGraph', href: 'https://www.langchain.com/langgraph' },
  { name: 'Next.js', href: 'https://nextjs.org/' },
  { name: 'FastAPI', href: 'https://fastapi.tiangolo.com/' },
  { name: 'Supabase', href: 'https://supabase.com/' },
  { name: 'PostgreSQL', href: 'https://www.postgresql.org/' },
  { name: 'Redis', href: 'https://redis.io/' },
  { name: 'Docker', href: 'https://www.docker.com/' },
  { name: 'Vercel', href: 'https://vercel.com/' },
  { name: 'AWS', href: 'https://aws.amazon.com/' },
];

export const tradingTools = [
  { name: 'TradingView', href: 'https://www.tradingview.com/' },
  { name: 'Futures platforms', href: '#' },
  { name: 'Poker probability tools', href: '#' },
  { name: 'Backtesting workflows', href: '#' },
  { name: 'Risk calculators', href: '#' },
];

export const software = [
  { name: 'Cursor / VS Code', href: 'https://cursor.com/' },
  { name: 'Xcode', href: 'https://developer.apple.com/xcode/' },
  { name: 'Docker Desktop', href: 'https://www.docker.com/products/docker-desktop/' },
  { name: 'Postman', href: 'https://www.postman.com/' },
  { name: 'Notion', href: 'https://www.notion.so/' },
  { name: 'GitHub', href: 'https://github.com/' },
];
