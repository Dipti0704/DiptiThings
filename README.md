# Dipti Hatwar — Portfolio

Personal portfolio showcasing projects in AI/ML, Agentic AI, Automations, and Data Engineering, built with Next.js, Tailwind CSS, and shadcn/ui.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

Repo: [github.com/Dipti0704/MY-PORTFOLIO](https://github.com/Dipti0704/MY-PORTFOLIO)

### Easiest: connect GitHub (recommended)

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import **Dipti0704/MY-PORTFOLIO** (or your repository's name).
3. Click **Deploy** (defaults are fine).
4. Every push to `main` redeploys automatically.

### CLI (run one command at a time)

```bash
npx vercel login
```

Preview deploy:

```bash
npm run deploy
```

Production deploy:

```bash
npm run deploy:prod
```

First time, the CLI will ask to link/create a project — choose your account and confirm.

Optional env var in Vercel → Settings → Environment Variables:

- `NEXT_PUBLIC_URL` = `https://your-project.vercel.app` (for social link previews)

## Customization

Most customizable data is located in `src/lib/site.ts` which drives the homepage, social configurations, projects lists, obsessions list, and tools list:

- Central Site Settings: `src/lib/site.ts`
- Additional config files: `src/config/`
- Resume File: `public/Dipti_Hatwar_Resume.pdf`

