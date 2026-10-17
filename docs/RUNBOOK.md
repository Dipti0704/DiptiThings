# Runbook

Each Prometheus alert links to a section here. General first steps:

```bash
make status
kubectl -n portfolio logs -l app.kubernetes.io/name=portfolio --tail=100
curl -s http://portfolio.localtest.me/api/version
```

Grafana dashboard: **Portfolio — service health** (http://grafana.localtest.me).

## contact-delivery-failing

`PortfolioContactErrorBudgetBurn`: contact submissions are failing faster than the 99% SLO allows.

1. **Symptom:** the dashboard panel *Contact submissions by outcome* shows `delivery_failed`.
2. **Logs:** `kubectl -n portfolio logs -l app.kubernetes.io/name=portfolio | grep contact.`
   - `contact.misconfigured` → the secret is missing. Check `kubectl -n portfolio get secret portfolio-secrets`
     and the SealedSecret status (`kubectl -n portfolio describe sealedsecret portfolio-secrets`).
   - `contact.telegram_error` with status 401/403 → the token was revoked. Re-seal it with `make seal-portfolio`.
   - `contact.telegram_unreachable` → network or DNS failure, or Telegram is down. Check NetworkPolicy
     egress and run `kubectl -n portfolio exec deploy/portfolio -- wget -qO- https://api.telegram.org`.
3. **Traces:** in Jaeger, look at the `telegram.sendMessage` spans (errors and duration).
4. **Verify recovery:** submit the form (or run `make smoke`). `contact_submissions_total{outcome="delivered"}`
   should increase and the alert should resolve.

## high-latency

`PortfolioHighEdgeLatency`: p95 at the ingress is above 500 ms for 10 minutes.

1. Check whether it's every route or only `/api/contact` (panel *API latency p95 by route*). If it's
   only contact, compare it with *Telegram API p95 latency*: the dependency is slow.
2. Check CPU throttling or saturation: `kubectl top pods -n portfolio` and `kubectl get hpa -n portfolio`.
   If the HPA is at max replicas, raise `autoscaling.maxReplicas` or the CPU limit in Git.
3. Verify: p95 drops below 0.5s on the dashboard.

## 5xx-errors

`PortfolioEdge5xx`: more than 5% of requests return 5xx.

1. **Look at status codes:**
   - 502/503 from Traefik with no app logs → no Ready endpoints (see *replicas-unavailable*).
   - 502 from the app → Telegram failures (see *contact-delivery-failing*).
2. **Check for a recent deploy:** `git log -3 deploy/envs/local/values.yaml` and the Argo CD app history.
   If the errors started with a deploy, `git revert` that commit and push.

## replicas-unavailable

`PortfolioReplicasUnavailable`: fewer available replicas than desired for 5 minutes. This is
usually a bad rollout.

1. `kubectl -n portfolio get pods` and `kubectl -n portfolio describe pod <new-pod>` to see why:
   - ImagePullBackOff → the image or tag is missing, or the GHCR package is private.
   - Readiness failing or CrashLoopBackOff → check `kubectl logs --previous`.
2. Old pods keep serving (maxUnavailable 0), so users aren't affected yet.
3. **Roll back:**
   ```bash
   git revert <deploy commit> && git push   # Argo CD syncs the previous image
   ```
4. **Verify:** `/api/version` shows the previous commit, all pods are Ready, and Argo CD is Healthy/Synced.

## pod-restarting

`PortfolioPodRestarting`: a container restarted more than twice in 15 minutes.

1. `kubectl -n portfolio describe pod <pod>` and look at *Last State*:
   - `OOMKilled` → raise the memory limit, or look for a leak on the *Pod memory* panel.
   - Liveness failures → the event loop is blocked; check the logs before the restart (`--previous`).

## metrics-down

`PortfolioMetricsDown`: Prometheus can't scrape any portfolio pod.

1. Look at the target status at http://prometheus.localtest.me/targets.
2. Make sure the NetworkPolicy still allows the `monitoring` namespace, and the ServiceMonitor exists:
   `kubectl -n portfolio get servicemonitor`.

## Fault demo: bad release and recovery

Use this to show a failure and its recovery on purpose.

1. **Change:** in `deploy/envs/local/values.yaml`, set the readiness probe to a path that
   doesn't exist (`probes.readiness.path: /api/does-not-exist`). Commit and push.
2. **Symptom:** Argo CD syncs and the new pod stays `0/1 Running`. Argo CD shows *Progressing*,
   then *Degraded*. The site keeps working because the old pods keep serving.
3. **Hypothesis:** the readiness probe fails, so the rollout can't continue.
4. **Evidence:**
   - `kubectl describe pod` shows `Readiness probe failed: HTTP probe failed with statuscode: 404`.
   - Repeated curls to `/api/version` still return the previous commit.
5. **Fix:** `git revert HEAD && git push`.
6. **Verify:** Argo CD is *Synced/Healthy*, all pods are Ready, there was no user-facing downtime
   during the incident (Traefik 5xx panel stays flat), and the `PortfolioReplicasUnavailable`
   alert resolves.
