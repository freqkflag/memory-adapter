#!/usr/bin/env bash

set -euo pipefail

PAM_HOST="${PAM_HOST:-127.0.0.1}"
PAM_PORT="${PAM_PORT:-3000}"
PAM_AUTH_TOKEN="${PAM_AUTH_TOKEN:-}"

BASE_URL="http://${PAM_HOST}:${PAM_PORT}"

AUTH_ARGS=()
if [ -n "${PAM_AUTH_TOKEN}" ]; then
  AUTH_ARGS=(-H "Authorization: Bearer ${PAM_AUTH_TOKEN}")
fi

echo "Smoke test: ${BASE_URL}"

pass=1

check() {
  name="$1"
  method="$2"
  path="$3"
  extraCurlArgs=("${@:4}")

  code="$(
    curl -sS -o /dev/null -w "%{http_code}" \
      "${AUTH_ARGS[@]}" \
      -X "${method}" \
      "${extraCurlArgs[@]}" \
      "${BASE_URL}${path}" || echo "000"
  )"

  if [ "${code}" -ge 200 ] && [ "${code}" -lt 300 ]; then
    echo "✔ ${name} (${code})"
  else
    echo "✘ ${name} (${code})"
    pass=0
  fi
}

check "GET /health" "GET" "/health"
check "GET /tools" "GET" "/tools"
check "POST /tool/list_tools" "POST" "/tool/list_tools" \
  -H "Content-Type: application/json" \
  --data '{}'

if [ "${pass}" -eq 1 ]; then
  echo "✔ All smoke tests passed."
else
  echo "✘ Smoke tests failed."
  exit 1
fi

