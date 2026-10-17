#!/usr/bin/env bash
# Creates the local kind cluster, installs Argo CD and hands everything else
# over to GitOps (root app). Safe to re-run.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLUSTER=portfolio
ARGOCD_CHART_VERSION=10.10.5
KEY_BACKUP="$ROOT/.secrets/sealed-secrets-key.yaml"

for bin in docker kind kubectl helm; do
  command -v "$bin" >/dev/null || { echo "missing: $bin" >&2; exit 1; }
done

if ! kind get clusters | grep -qx "$CLUSTER"; then
  kind create cluster --config "$ROOT/deploy/kind/cluster.yaml"
fi
kubectl config use-context "kind-$CLUSTER" >/dev/null

# Sealed secrets in Git are encrypted for one controller key. Restoring the
# backed-up key lets a re-created cluster decrypt the existing files.
if [[ -f "$KEY_BACKUP" ]]; then
  echo "restoring sealed-secrets key from $KEY_BACKUP"
  kubectl apply -n kube-system -f "$KEY_BACKUP"
fi

helm repo add argo https://argoproj.github.io/argo-helm >/dev/null 2>&1 || true
helm repo update argo >/dev/null
helm upgrade --install argocd argo/argo-cd \
  --namespace argocd --create-namespace \
  --version "$ARGOCD_CHART_VERSION" \
  -f "$ROOT/deploy/argocd/bootstrap/argocd-values.yaml" \
  --wait --timeout 10m

kubectl apply -f "$ROOT/deploy/argocd/bootstrap/root-app.yaml"

echo
echo "Argo CD is syncing the platform. Watch with: kubectl get applications -n argocd -w"
echo "Argo CD UI:  http://argocd.localtest.me  (user: admin)"
echo "Password:    kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d"
