# Dipti Hatwar — Portfolio

Personal portfolio (Next.js 16, Tailwind CSS, shadcn/ui) with a contact form that
forwards messages to Telegram. This repository also contains the DevOps setup
built for the Scaler **Advanced DevOps** project: container image, Helm chart,
GitOps delivery with Argo CD to a local kind cluster, CI/CD on GitHub Actions,
and observability with Prometheus, Grafana and Jaeger.

| | |
|---|---|
| Baseline commit | [`32b537f`](https://github.com/Dipti0704/DiptiThings/commit/32b537f55040f9baaa788d1a5b0c5c59678b23b5) |
| Architecture | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Design decisions | [docs/DECISIONS.md](docs/DECISIONS.md) |
| Alert runbook | [docs/RUNBOOK.md](docs/RUNBOOK.md) |
| Evidence | [docs/EVIDENCE.md](docs/EVIDENCE.md) |

## What was added on top of the baseline

The baseline was a Vercel-hosted Next.js site with an `eslint` script and git-ignored
`.env*` files — no container, CI, tests, health checks or monitoring.

- **App:** `/api/health`, `/api/ready`, `/api/version`, `/api/metrics`; JSON logs
  (pino, PII redacted); OpenTelemetry traces; timeout on the Telegram call; tests.
- **Image:** multi-stage `Dockerfile`, Next.js standalone output, non-root, read-only root FS.
- **Kubernetes:** Helm chart `deploy/helm/portfolio` — Deployment with startup/liveness/readiness
  probes, resources, HPA, PDB, NetworkPolicy, Ingress (metrics path blocked), SealedSecret,
  ServiceMonitor, PrometheusRule and Grafana dashboard.
- **GitOps:** Argo CD app-of-apps (`deploy/argocd`) manages Traefik, sealed-secrets,
  metrics-server, kube-prometheus-stack, Jaeger and the app.
- **CI/CD:** `.github/workflows/ci.yml` (lint, typecheck, tests, build, audit, gitleaks,
  Trivy config scan, helm lint, kubeconform) and `release.yml` (multi-arch image → GHCR,
  Trivy image scan, deploy + smoke test on an ephemeral kind cluster, commit image tag for Argo CD).

## Run locally (development)

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit/API tests
```

Contact form delivery needs `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in `.env.local`.
Set `CONTACT_DELIVERY=log` to record submissions in the log instead.

## Run on Kubernetes (kind + Argo CD)

### Prerequisites

- Docker Desktop with **≥ 6 GB** memory (8 GB recommended)
- `kind`, `kubectl`, `helm`, `kubeseal`, `yq` (macOS: `brew install kind kubectl helm kubeseal yq`)
- Optional: `argocd` CLI
- Ports 80/443 free on `127.0.0.1`

### 1. Bootstrap the cluster

```bash
make bootstrap
```

This creates the `portfolio` kind cluster, installs Argo CD with Helm, and applies
`deploy/argocd/bootstrap/root-app.yaml`. From then on Argo CD installs everything else
from Git. Watch progress:

```bash
kubectl get applications -n argocd -w
```

### 2. Seal the secrets (once per cluster)

```bash
make seal-grafana                                              # Grafana admin password
TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... make seal-portfolio  # contact form
make backup-key                                                # keep the sealing key (git-ignored)
git add deploy && git commit -m "chore: seal secrets" && git push
```

Only ciphertext is committed. Without the Telegram secret the site still runs, and
`/api/ready` reports `contactDelivery: missing`.

### 3. Access

All hostnames resolve to `127.0.0.1` via `localtest.me`; the cluster only listens on loopback.

| Service | URL | Login |
|---|---|---|
| Portfolio | http://portfolio.localtest.me | — |
| Argo CD | http://argocd.localtest.me | `admin` / `kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' \| base64 -d` |
| Grafana | http://grafana.localtest.me | `admin` / `kubectl -n monitoring get secret grafana-admin -o jsonpath='{.data.admin-password}' \| base64 -d` |
| Prometheus | http://prometheus.localtest.me | — |
| Alertmanager | http://alertmanager.localtest.me | — |
| Jaeger | http://jaeger.localtest.me | — |

```bash
make status    # Argo CD apps + workload
make smoke     # readiness, version, home page, contact submission, metrics blocked
```

### How a change gets deployed

1. Push to `main` (or the `devops/**` branch Argo CD tracks) → `release.yml` runs.
2. CI checks pass → images built natively for amd64 and arm64 → pushed to
   `ghcr.io/dipti0704/diptithings:sha-<commit>` → Trivy scan.
3. The image is installed with `helm --atomic` on a throwaway kind cluster in CI and smoke-tested,
   including a check that `/api/version` reports the commit.
4. CI commits the new `image.tag` and `image.digest` to `deploy/envs/local/values.yaml`.
5. Argo CD sees the change within about 60s and does a rolling update; readiness probes gate traffic.

Rollback: `git revert <deploy commit>` and push. Argo CD rolls back to the previous image.

### Tear down

```bash
make destroy
```

## Known limitations

- Single-node local cluster: topology spread and the PDB are configured but cannot show
  cross-node resilience.
- The contact rate limiter is in-memory, so each replica counts separately (effective limit is
  5 × replicas per minute). A shared store such as Redis would fix this.
- GitHub cannot reach the laptop cluster, so Argo CD polls Git (about 60s delay) instead of
  receiving webhooks.
- Sealed secrets are tied to the cluster's key. A recreated cluster needs `make backup-key`'s
  file restored (the bootstrap script does this) or the secrets re-sealed.
- The GHCR package must be public, or an `imagePullSecret` added, for kind to pull it.
- Jaeger keeps traces in memory, and Prometheus retention is 2 days. Alertmanager has no
  receivers configured; alerts can be viewed in its UI.
- Vercel deployment from the baseline still works but is separate from this pipeline.

## Customization

Most site content lives in `src/lib/site.ts`; additional config is in `src/config/`.
