#!/usr/bin/env bash

set -euo pipefail

ENV_FILE="/etc/pam/pam.env"
SERVICE_UNIT="pam.service"

fail=0

log() {
  echo "[$(date -Iseconds)] $*"
}

auth_token=""
port=""

if [ -f "${ENV_FILE}" ]; then
  # shellcheck disable=SC1090
  set -a
  . "${ENV_FILE}"
  set +a
  auth_token="${PAM_AUTH_TOKEN:-}"
  port="${PAM_PORT:-3000}"
else
  port="3000"
fi

BASE_URL="http://127.0.0.1:${port}"
AUTH_HEADER=()
if [ -n "${auth_token}" ]; then
  AUTH_HEADER=(-H "Authorization: Bearer ${auth_token}")
fi

check() {
  name="$1"
  method="$2"
  path="$3"
  data="${4:-}"

  code="$(
    curl -sS -o /dev/null -w "%{http_code}" \
      "${AUTH_HEADER[@]}" \
      -X "${method}" \
      -H "Content-Type: application/json" \
      ${data:+--data "${data}"} \
      "${BASE_URL}${path}" || echo "000"
  )"

  if [ "${code}" -ge 200 ] && [ "${code}" -lt 300 ]; then
    log "✔ ${name} (${code})"
  else
    log "✘ ${name} (${code})"
    fail=1
  fi
}

if systemctl is-active --quiet "${SERVICE_UNIT}"; then
  log "✔ ${SERVICE_UNIT} active"
else
  log "✘ ${SERVICE_UNIT} not active"
  fail=1
fi

if [ -z "${auth_token}" ]; then
  log "✘ PAM_AUTH_TOKEN missing; auth endpoints expected to be protected"
  fail=1
fi

check "GET /health" "GET" "/health"
check "GET /tools" "GET" "/tools"
check "POST /tool/list_tools" "POST" "/tool/list_tools" "{}"

if [ "${fail}" -eq 0 ]; then
  log "✔ VM smoke tests passed."
  exit 0
fi

log "✘ VM smoke tests failed."
exit 1

