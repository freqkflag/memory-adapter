#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=./lib-remote-env.sh
source "${SCRIPT_DIR}/lib-remote-env.sh"
load_remote_defaults

if [ "$(uname -s)" = "Darwin" ]; then
  echo "remote-smoke-test.sh must run on the remote VM."
  exit 1
fi

ENV_FILE="${PAM_ENV_FILE:-/etc/pam/pam.env}"
if [ -f "${ENV_FILE}" ]; then
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
fi

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

