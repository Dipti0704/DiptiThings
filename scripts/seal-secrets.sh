#!/usr/bin/env bash
# Encrypts secrets with the cluster's sealed-secrets public key and writes the
# ciphertext into Git-tracked files. Plain-text values never touch the repo.
#
#   TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... scripts/seal-secrets.sh portfolio
#   TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... scripts/seal-secrets.sh alerting
#   scripts/seal-secrets.sh grafana        # generates a random admin password
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CERT="$(mktemp)"
trap 'rm -f "$CERT"' EXIT
kubeseal --controller-namespace kube-system --controller-name sealed-secrets-controller \
  --fetch-cert > "$CERT"

seal_value() { # namespace secret-name value
  printf '%s' "$3" | kubeseal --cert "$CERT" --raw --namespace "$1" --name "$2"
}

case "${1:-}" in
  portfolio)
    : "${TELEGRAM_BOT_TOKEN:?set TELEGRAM_BOT_TOKEN}" "${TELEGRAM_CHAT_ID:?set TELEGRAM_CHAT_ID}"
    token="$(seal_value portfolio portfolio-secrets "$TELEGRAM_BOT_TOKEN")"
    chat="$(seal_value portfolio portfolio-secrets "$TELEGRAM_CHAT_ID")"
    yq -i ".secret.sealed.encryptedData.TELEGRAM_BOT_TOKEN = \"$token\" |
           .secret.sealed.encryptedData.TELEGRAM_CHAT_ID = \"$chat\"" \
      "$ROOT/deploy/envs/local/values.yaml"
    echo "updated deploy/envs/local/values.yaml — commit and push to deploy"
    ;;
  alerting)
    # Alertmanager reads these as files (bot_token_file / chat_id_file).
    # Without real values a placeholder keeps Alertmanager running; Telegram
    # rejects it and alertmanager_notifications_failed_total shows the gap.
    token="${TELEGRAM_BOT_TOKEN:-not-configured}"
    chat="${TELEGRAM_CHAT_ID:-0}"
    kubectl create secret generic alertmanager-telegram --namespace monitoring \
      --from-literal=bot-token="$token" --from-literal=chat-id="$chat" \
      --dry-run=client -o yaml |
      kubeseal --cert "$CERT" --format yaml > "$ROOT/deploy/platform/secrets/alertmanager-telegram.yaml"
    echo "wrote deploy/platform/secrets/alertmanager-telegram.yaml — commit and push to deploy"
    ;;
  grafana)
    password="${GRAFANA_ADMIN_PASSWORD:-$(openssl rand -base64 24)}"
    kubectl create secret generic grafana-admin --namespace monitoring \
      --from-literal=admin-user=admin --from-literal=admin-password="$password" \
      --dry-run=client -o yaml |
      kubeseal --cert "$CERT" --format yaml > "$ROOT/deploy/platform/secrets/grafana-admin.yaml"
    echo "wrote deploy/platform/secrets/grafana-admin.yaml — commit and push to deploy"
    echo "Grafana admin password (store it in your password manager): $password"
    ;;
  backup-key)
    mkdir -p "$ROOT/.secrets"
    kubectl get secret -n kube-system -l sealedsecrets.bitnami.com/sealed-secrets-key -o yaml \
      > "$ROOT/.secrets/sealed-secrets-key.yaml"
    echo "private sealing key saved to .secrets/ (git-ignored) — keep it safe"
    ;;
  *)
    echo "usage: $0 portfolio|alerting|grafana|backup-key" >&2
    exit 1
    ;;
esac
