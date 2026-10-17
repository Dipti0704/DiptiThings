# Design decisions and trade-offs

Short notes for each choice: what was chosen, what else was considered, and when the
other option would be better.

## Workload and runtime

**Deployment, not StatefulSet.** The app keeps no state: pages are pre-rendered and contact
messages go straight to Telegram. Pods are interchangeable, so a Deployment with rolling
updates fits. A StatefulSet would only make sense with per-pod identity or storage, for
example if submissions were stored in a database running in the cluster.

**No PersistentVolume.** Nothing needs to survive a pod restart. The Next.js cache and `/tmp`
use size-limited `emptyDir` volumes, because the root filesystem is read-only.

**Three probes with different jobs.**
- *startup* (`/api/health`, up to 60s): protects slow cold starts from liveness kills.
- *liveness* (`/api/health`): only checks that the process can respond. It has **no
  dependency checks**, otherwise a Telegram outage would restart every pod for nothing.
- *readiness* (`/api/ready`): reports config status but stays Ready when Telegram isn't
  configured. The pages still work, so removing pods from rotation would turn a partial
  outage into a full one.

**Resources.** Requests are 100m CPU / 192Mi, limits 500m / 384Mi. The idle standalone server
uses about 80–120 MiB RSS. The memory limit stops a leak from taking down the node. The CPU
limit is generous because Next.js has short bursts (SSR, image work).

**HPA 2–5 on 70% CPU, PDB minAvailable 1.** Two replicas give zero-downtime rollouts and
survive one pod failure. CPU is the only saturation signal this app has. Request-rate scaling
would need a custom-metrics adapter, which isn't worth it at this traffic. Argo CD ignores
`spec.replicas` so it doesn't fight the HPA.

**Graceful shutdown.** A `preStop` sleep of 5s keeps the pod serving while its endpoint is
removed from Traefik and the Service. Without it, a rolling update can return a few 502s.

## Configuration

**Helm chart plus per-environment values.** Considered: raw manifests (copied per environment,
so they drift), Kustomize (good for patching, weaker for conditionals). Helm gives one
templated chart with capability checks (ServiceMonitor, Middleware and SealedSecret are only
rendered when their CRDs exist). That lets the same chart run on a bare CI kind cluster and on
the full local platform.

**Image pinned by digest.** CI writes both `tag` (readable) and `digest` (immutable). A
re-pushed tag can't change what runs.

## Delivery

**GitHub Actions for CI, Argo CD for CD (pull-based GitOps).**
- GitHub can't reach a laptop cluster, so a push-based `helm upgrade` from CI is impossible
  without a self-hosted runner.
- Argo CD inside the cluster pulls from Git: no inbound access or cluster credentials in CI.
- `selfHeal` reverts manual `kubectl` changes, which is drift control.
- Trade-off: changes arrive by polling (60s) and there's one more component to run. On a
  cloud cluster, a GitHub webhook to Argo CD would remove the delay.

**CI commits the image tag (instead of Argo CD Image Updater).**
- Every deploy is a Git commit naming the image and the Actions run, so `git log
  deploy/envs/local` is the deploy history.
- Rollback is `git revert`.
- Image Updater would avoid bot commits but adds a component and makes history harder to trace.

**Multi-arch image built on native runners.** The local kind node is arm64 (Apple Silicon)
and CI runners default to amd64. QEMU emulation of `next build` is very slow, so each
architecture builds natively (`ubuntu-24.04-arm`) and the digests are merged into one
manifest list.

**Ephemeral kind smoke test in CI.** Before the tag is promoted, CI installs the chart with
`helm --atomic` on a throwaway cluster and checks that `/api/version` returns the commit. That
proves the image starts, passes probes and works with the chart, before Argo CD ever sees it.

**Approval = PR review.** Deploys to the local environment are automatic once a commit
reaches the tracked branch. The human gate is the pull-request review (with branch protection
on `main`). A GitHub Environment with required reviewers on the `promote` job would be the
next step for a production environment.

## Release control

**Rolling update, maxSurge 1 / maxUnavailable 0, gated by readiness.** A new version gets
traffic only after it passes readiness, and old pods are removed only after a replacement is
Ready. A broken version stalls the rollout instead of causing an outage.

**Recovery.** `git revert` the deploy commit (the GitOps way: Git stays the source of truth).
`argocd app rollback` is faster but turns off auto-sync until re-enabled, so it's for
emergencies only. In CI, `helm --atomic` rolls back automatically.

**Why not canary or blue-green?** With a single small service and low traffic, a canary
wouldn't get enough requests to judge. Argo Rollouts plus analysis on Traefik metrics would
be the upgrade if traffic grew or releases became riskier.

## Security

- **Secrets:** Sealed Secrets, so only ciphertext goes into Git and the controller's private
  key never leaves the cluster (backup kept git-ignored). Alternatives:
  - External Secrets + Vault or a cloud secret manager: better rotation, needs external infrastructure.
  - SOPS: decrypts on the deploy side.
- **Pod hardening:**
  - non-root uid 1000, read-only root FS, all capabilities dropped
  - no privilege escalation, `RuntimeDefault` seccomp
  - no service-account token (the app doesn't call the Kubernetes API)
- **Network:** a NetworkPolicy allows ingress only from Traefik and Prometheus, and egress
  only to DNS, HTTPS outside the cluster (Telegram) and Jaeger.
  - kind's port mappings bind to `127.0.0.1` only.
  - `/api/metrics` is blocked at the ingress.
- **Pipeline:**
  - least-privilege `GITHUB_TOKEN` per job (`contents: read` by default; `packages: write`
    only for build; `contents: write` only for promote)
  - third-party actions pinned to commit SHAs
  - gitleaks over full history; Trivy config and image scans; `npm audit`
  - SBOM and provenance attestations on the image
- **App:** security headers, `X-Powered-By` removed, input validation, rate limiting, PII
  redacted from logs.

## Observability

**What "healthy" means (SLOs):**
- 99% of contact submissions reach Telegram (the user journey that has a dependency).
- p95 latency at the ingress is under 500 ms for all routes.

**Signals:**
- *Edge (Traefik):* request rate, status codes and latency per service. This is what users
  actually see, including static pages.
- *App (prom-client):* contact outcomes, Telegram latency, API latency, Node runtime, `app_build_info`.
- *Cluster (kube-state-metrics):* replicas available, restarts.
- *Logs:* JSON on stdout with `version` and `commit` on every line; Traefik access logs in JSON.
- *Traces:* OpenTelemetry → Jaeger. A contact request shows the Next.js server span and the
  `telegram.sendMessage` child span, so slow responses can be blamed on the dependency or the app.

**Alerts → actions:** each alert has a `runbook_url` to [RUNBOOK.md](RUNBOOK.md). The contact
alert uses a multi-window burn rate (5m and 1h at 14.4×), so it fires on real budget burn
rather than a single failed request.

## What I would change under different requirements

| If… | Change |
|---|---|
| Submissions must never be lost | Queue or DB (Redis/Postgres) between the API and Telegram, with retries. The app then has state, so add a managed DB or a StatefulSet. |
| Multiple replicas must share one rate limit | Redis-backed limiter, or do rate limiting at the Traefik middleware. |
| Real production on a cloud cluster | Separate prod environment values, TLS via cert-manager, Argo CD webhook, External Secrets, GitHub Environment approvals, multi-node with zone spread. |
| Higher traffic / risky releases | Argo Rollouts canary with automated analysis on the 5xx and latency SLIs. |
| Strict log retention or search | Loki or OpenSearch with a Promtail/Fluent Bit DaemonSet. |
