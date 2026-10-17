# Runbook

Each Prometheus alert links to a section here. General first steps:

```bash
make status
kubectl -n portfolio logs -l app.kubernetes.io/name=portfolio --tail=100
curl -s http://portfolio.localtest.me/api/version
```

Grafana dashboard: **Portfolio — service health** (http://grafana.localtest.me).

## How alerts reach a human

```
Prometheus rules ──► Alertmanager ──► route by severity ──► Telegram (bot_token_file / chat_id_file)
```

| Severity | Delivery | group_wait | Repeat |
|---|---|---|---|
| critical | Telegram | 10s | every 1h until resolved |
| warning | Telegram | 30s | every 4h |
| info, `Watchdog`, `InfoInhibitor` | dropped (`null`) | — | — |

**Inhibition:**
- A critical alert silences the warning with the same name and namespace.
- `PortfolioMetricsDown` silences the other portfolio alerts, because they can't be trusted
  without metrics.

**Telegram credentials:** they come from the SealedSecret `monitoring/alertmanager-telegram`.
Until real values are sealed (`TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... make seal-telegram`,
then push), the secret holds a placeholder:
- Alertmanager keeps running and routing.
- Delivery attempts fail.
- The failures show in `alertmanager_notifications_failed_total{integration="telegram"}`, and the
  built-in `AlertmanagerFailedToSendAlerts` alert fires.

**Check the wiring:**

```bash
# which receiver a given alert would go to
kubectl -n monitoring exec alertmanager-monitoring-kube-prometheus-alertmanager-0 -c alertmanager -- \
  amtool config routes test --config.file=/etc/alertmanager/config_out/alertmanager.env.yaml severity=critical alertname=X
# delivery attempts / failures per integration
curl -s 'http://prometheus.localtest.me/api/v1/query?query=alertmanager_notifications_total'
```

`Watchdog` always fires on purpose. Pointing it at an external dead man's switch (for example
healthchecks.io) would detect a broken alerting pipeline. That isn't wired locally.

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

## contact-delivery-not-configured

`PortfolioContactDeliveryNotConfigured`: the app has no Telegram credentials (`contact_delivery_configured == 0`).

1. Confirm the readiness output: `curl -s http://portfolio.localtest.me/api/ready` shows `contactDelivery: missing`.
2. Check the secret: `kubectl -n portfolio get secret portfolio-secrets`, and look for unseal errors with
   `kubectl -n portfolio describe sealedsecret portfolio-secrets`.
3. Fix it: `TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... make seal-portfolio`, then commit and push.
   Argo CD syncs, and the pods restart with the new env (the checksum changes the pod template).
4. Verify: the gauge returns to 1, the alert resolves, and a contact submission returns 200.

## contact-abuse

`PortfolioContactAbuse`: sustained `rate_limited` submissions.

1. Find the source in the Traefik access logs: `kubectl -n traefik logs deploy/traefik | grep /api/contact`.
2. The limiter is per pod and in memory. For a real attack, add a Traefik `rateLimit` middleware or block the client IP at the edge.

## resource-saturation

`PortfolioMemoryNearLimit`, `PortfolioCPUThrottled`, `PortfolioAutoscalerMaxedOut`.

1. Check usage: `kubectl top pods -n portfolio` and `kubectl get hpa -n portfolio`.
2. Memory climbing steadily (*Pod memory* panel) → a leak; find the version where it started via `app_build_info`.
   A plateau near the limit → raise `resources.limits.memory` in Git.
3. CPU throttling with the HPA at max → raise `autoscaling.maxReplicas` or the CPU limit in
   `deploy/envs/local/values.yaml`, then push.

## argocd-app-unhealthy

`ArgoCDAppUnhealthy`, `ArgoCDAppOutOfSync`, `ArgoCDSyncFailed`, `ArgoCDNotReporting`.

1. `kubectl get applications -n argocd`, then `kubectl -n argocd get application <name> -o jsonpath='{.status.conditions}'`.
2. Common causes:
   - chart values rejected by the schema
   - missing CRDs (sync waves)
   - image pull errors
   - a SealedSecret that can't be decrypted
3. Fix in Git and push. Argo CD retries automatically. Don't patch the cluster by hand, because `selfHeal` reverts it.

## traefik-down

`TraefikDown`: no healthy ingress controller, so every public URL fails.

1. `kubectl -n traefik get pods` and `kubectl -n traefik describe pod`. Image pulls can fail on transient Docker Desktop DNS
   errors; delete the pod to retry.
2. Verify: `curl -I http://portfolio.localtest.me` returns 200.

## sealed-secret-unseal-failed

`SealedSecretUnsealFailed`: the controller can't decrypt a SealedSecret.

1. `kubectl get sealedsecrets -A`, then `kubectl describe sealedsecret <name>` for the error.
2. Usual cause: the file was sealed for a different cluster key (the cluster was recreated) or a different namespace or name.
   Restore the key with `.secrets/sealed-secrets-key.yaml` (`make bootstrap` does this) or re-seal, then push.

## tracing-backend-down

`TracingBackendDown`: Jaeger is unavailable. The app is unaffected (span export fails silently), but traces are lost.

1. `kubectl -n tracing get pods`. Jaeger keeps traces in memory, so a restart loses them; that's expected.

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
