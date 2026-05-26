# Taranpreet Singh — Portfolio

Personal portfolio built with Next.js, Tailwind CSS, and shadcn/ui.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

Repo: [github.com/taran1610/taranships](https://github.com/taran1610/taranships)

### Easiest: connect GitHub (recommended)

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import **taran1610/taranships**.
3. Click **Deploy** (defaults are fine).
4. Every push to `main` redeploys automatically.

### CLI (run one command at a time)

Do **not** paste multiple lines with `# comments` — zsh can throw `missing end of string` or `Can't deploy more than one path`.

```bash
cd /Users/sonal/taranships
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

### Add to X

1. Open **X → Profile → Edit profile**.
2. Set **Website** to your deployed URL.
3. Optional: pin a post linking to a project (Gloomberg, Compass, etc.).

When someone opens your link from X, they get a large preview card (title, description, image) from the site metadata.

## Customize

Edit files in `src/config/` — `Hero.tsx`, `About.tsx`, `Projects.tsx`, `Experience.tsx`, etc.
