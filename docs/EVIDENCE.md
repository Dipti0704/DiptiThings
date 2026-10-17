# Evidence

Everything below was captured from this project on **17 Oct 2026**, using the local kind
cluster (`kind-portfolio`, arm64) and GitHub Actions.

## 1. Tested version: commit → pipeline → image → Git → cluster

| Step | Value |
|---|---|
| Source commit | [`f603948`](https://github.com/Dipti0704/DiptiThings/commit/f60394814cb962ef15eb8e555b71db1862789b85) `fix(metrics): drop default service label from the app registry` |
| Release pipeline | [run 39013954202](https://github.com/Dipti0704/DiptiThings/actions/runs/39013954202): ci → build amd64 + arm64 → publish + Trivy → kind smoke test → promote, all green |
| Image | `ghcr.io/dipti0704/diptithings:sha-f603948@sha256:480d21323d3e69bad85c9089f09065e9e305c3a777491ec1392e3a39b11a7b60` |
| Deploy commit (by CI) | [`c28ef62`](https://github.com/Dipti0704/DiptiThings/commit/c28ef628836e17e7d8af2cdb47717c15a0821e52) `deploy(local): portfolio sha-f603948`: updates `deploy/envs/local/values.yaml` |
| Argo CD | `portfolio  Synced  Healthy`, sync revision `c28ef628836e17e7d8af2cdb47717c15a0821e52` |
| Running Deployment image | `ghcr.io/dipti0704/diptithings:sha-f603948@sha256:480d2132…` |
| `GET /api/version` | `{"version":"sha-f60394814cb9…","commit":"f60394814cb962ef15eb8e555b71db1862789b85","buildTime":"2026-10-17T13:01:28+05:30","environment":"local"}` |
| Prometheus `app_build_info` | `commit="f60394814cb9…"` on both pods |

No `kubectl apply` or `helm upgrade` was run by hand. The rollout came from Argo CD
detecting the deploy commit.

Reproduce:

```bash
git log --oneline -3 deploy/envs/local/values.yaml
kubectl get application portfolio -n argocd -o jsonpath='{.status.sync.revision}'
kubectl get deploy portfolio -n portfolio -o jsonpath='{.spec.template.spec.containers[0].image}'
curl -s http://portfolio.localtest.me/api/version
```

## 2. Working user journey (`make smoke`, through the real ingress)

```
→ readiness
{"status":"ready","checks":{"contactDelivery":"missing"}}
→ version
{"version":"sha-f60394814cb962ef15eb8e555b71db1862789b85","commit":"f60394814cb962ef15eb8e555b71db1862789b85",...}
→ home page
200
→ contact submission
{"error":"Failed to send message. Please try again."}
HTTP 502
→ metrics endpoint (expect 403 through the ingress, 200 in-cluster)
/api/metrics → 403
```

- **Contact returns 502** because the Telegram secret hasn't been sealed into this cluster yet
  (`contactDelivery: missing`). This is the dependency-failure path working as designed:
  - pages stay up
  - the failure is counted in `contact_submissions_total{outcome="delivery_failed"}`
  - it's logged as `contact.misconfigured`
- After `make seal-portfolio` and a push, the same request returns 200.
- The CI smoke test runs the successful path with `CONTACT_DELIVERY=log`: the contact
  request returns `200 {"message":"Message sent successfully!"}` and `/api/version` matches
  the commit (see the *deploy to ephemeral kind* job in the run above).

## 3. Platform state

```
NAME              SYNC STATUS   HEALTH STATUS
metrics-server    Synced        Healthy
monitoring        Synced        Healthy
portfolio         Synced        Healthy
prometheus-crds   Synced        Healthy
root              Synced        Healthy
sealed-secrets    Synced        Healthy
tracing           Synced        Healthy
traefik           Synced        Healthy
```

Workload (namespace `portfolio`):
- Deployment 2/2 available
- HPA `cpu: 11%/70%` (2–5 replicas)
- PDB minAvailable 1
- NetworkPolicy present
- Ingress `portfolio` and `portfolio-metrics-blocked` with address `127.0.0.1`

Pod security as applied:

```
pod:       {"fsGroup":1000,"runAsGroup":1000,"runAsNonRoot":true,"runAsUser":1000,"seccompProfile":{"type":"RuntimeDefault"}}
container: {"allowPrivilegeEscalation":false,"capabilities":{"drop":["ALL"]},"readOnlyRootFilesystem":true}
```

## 4. Observability

- **Prometheus targets:** `portfolio` (both pods) and `traefik-metrics`, all `up`.
- **Rules loaded:**
  - `portfolio.sli`: `contact_success` ratios over 5m/1h, `edge_latency:p95_5m`, `edge_5xx:ratio_rate5m`
  - `portfolio.alerts`: `PortfolioContactErrorBudgetBurn`, `PortfolioHighEdgeLatency`, `PortfolioEdge5xx`,
    `PortfolioReplicasUnavailable`, `PortfolioPodRestarting`, `PortfolioMetricsDown`
- **Measured SLIs:**
  - `portfolio:edge_latency:p95_5m = 0.095s` (target < 0.5s)
  - `portfolio:edge_5xx:ratio_rate5m = 0`
- **Logs:** JSON lines carry `version` and `commit`, for example:
  ```json
  {"level":50,"service":"portfolio","version":"sha-f60394814cb962ef15eb8e555b71db1862789b85","commit":"f60394814cb962ef15eb8e555b71db1862789b85","event":"contact.misconfigured","msg":"Telegram credentials not configured"}
  ```
- **Traces:** Jaeger lists services `["jaeger","portfolio"]` (`GET /api/v3/services`). Contact
  requests include a `telegram.sendMessage` span.
- **Dashboard:** Grafana → *Portfolio — service health*, provisioned from
  `deploy/helm/portfolio/dashboards/portfolio.json`.

## 5. Security checks

- **CI gates on every run:**
  - gitleaks (full history)
  - Trivy config scan (HIGH/CRITICAL) over the Dockerfile, chart and manifests
  - `npm audit` (critical)
  - Trivy image scan (fixable critical)
- **The gate caught a real issue:** the first pipeline run failed `npm audit`, because Next.js
  16.2.6 from the baseline had a critical advisory. It was fixed by upgrading to 16.4.2
  (commit `ddbf5b8`).
- **Secrets:** only SealedSecret ciphertext is in Git (`deploy/platform/secrets/grafana-admin.yaml`).
- **Exposure:**
  - `/api/metrics` returns 403 from outside
  - kind listens on `127.0.0.1` only
  - the NetworkPolicy limits ingress to Traefik and Prometheus

## 6. Drift control

A manual change to the live ConfigMap (`LOG_LEVEL=debug`) was reverted to `info` by Argo CD
`selfHeal` within seconds:

```
configmap/portfolio patched
LOG_LEVEL reverted to info by Argo CD selfHeal
```

## 7. Fault and recovery demonstration

Following [RUNBOOK.md › Fault demo](RUNBOOK.md#fault-demo-bad-release-and-recovery):

1. **Change:** commit `86e6f51` set `probes.readiness.path: /api/does-not-exist` and was pushed.
   Argo CD synced it.
2. **Symptom:** the new pod stayed `0/1 Running`, and Argo CD reported *Progressing*.
3. **Evidence:**
   - Event: `Readiness probe failed: HTTP probe failed with statuscode: 404`.
   - During the incident, five requests to `/` returned `200 200 200 200 200`, and
     `/api/version` still showed the previous commit.
   - maxUnavailable 0 kept the old pods serving, so users saw no impact.
4. **Fix:** `git revert` → commit `25bb1f4`, pushed.
5. **Verify:**
   - Argo CD returned to `Healthy Synced` on the revert revision.
   - The broken pod was terminated, and 2/2 old-version pods remained.

## Notes and limitations of this evidence

- Commit SHAs before `f603948` were rewritten once, to remove commit-message trailers. Argo CD's
  sync history and the images `sha-36bb65f`, `sha-410d7b4` and `sha-ff32d0a` refer to the
  pre-rewrite SHAs. The baseline `32b537f` was not affected. Section 1 uses a post-rewrite
  commit, so its chain is complete.
- Screenshots of Argo CD, Grafana and Jaeger can be added under `docs/img/` from the URLs in
  the README.
- Single-node cluster: the PDB and topology spread are configured but not exercised across nodes.
