#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${1:-https://pam.cultofjoey.com}"
TOKEN="${PAM_AUTH_TOKEN:-}"

pass=1

check() {
  local name="$1"
  local method="$2"
  local path="$3"
  shift 3
  local extra=("$@")
  local auth_args=()

  if [ -n "${TOKEN}" ]; then
    auth_args=(-H "Authorization: Bearer ${TOKEN}")
  fi

  local code
  code="$(curl -sS -o /dev/null -w "%{http_code}" "${auth_args[@]}" -X "${method}" "${extra[@]}" "${BASE_URL}${path}" || echo "000")"

  if [ "${code}" -ge 200 ] && [ "${code}" -lt 300 ]; then
    echo "PASS ${name} (${code})"
  else
    echo "FAIL ${name} (${code})"
    pass=0
  fi
}

echo "Verifying public access at: ${BASE_URL}"
if [ -z "${TOKEN}" ]; then
  echo "PAM_AUTH_TOKEN not set; protected endpoints may return 401."
fi
echo

check "GET /health" "GET" "/health"
check "GET /tools" "GET" "/tools"
check "POST /tool/list_tools" "POST" "/tool/list_tools" -H "Content-Type: application/json" --data '{}'

echo
if [ "${pass}" -eq 1 ]; then
  echo "Public verification passed."
else
  echo "Public verification failed."
  if [ -z "${TOKEN}" ]; then
    echo "Set token and retry:"
    echo "PAM_AUTH_TOKEN='<real-token>' bash scripts/verify-public-access.sh ${BASE_URL}"
  fi
  exit 1
fi
