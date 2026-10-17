#!/usr/bin/env bash
# End-to-end check of a running deployment: health, version, page, contact.
#   scripts/smoke.sh <base-url> [expected-commit]
set -euo pipefail
BASE="${1:?base url}"
EXPECTED="${2:-}"

echo "→ readiness";  curl -fsS "$BASE/api/ready"; echo
echo "→ version";    version="$(curl -fsS "$BASE/api/version")"; echo "$version"
if [[ -n "$EXPECTED" ]] && ! grep -q "\"commit\":\"$EXPECTED\"" <<<"$version"; then
  echo "running commit does not match $EXPECTED" >&2; exit 1
fi
echo "→ home page";  curl -fsS -o /dev/null -w "%{http_code}\n" "$BASE/"
echo "→ contact submission"
curl -sS -w "\nHTTP %{http_code}\n" -X POST "$BASE/api/contact" \
  -H 'content-type: application/json' \
  -d '{"name":"Smoke Test","email":"smoke@example.com","phone":"0000000000","message":"automated smoke test"}'
echo "→ metrics hidden from the ingress"
code="$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/metrics")"
echo "/api/metrics → $code"
