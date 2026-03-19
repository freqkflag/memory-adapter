#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${1:-https://pam.cultofjoey.com}"
TOKEN="${PAM_AUTH_TOKEN:-}"

pass=1
health_code=""
tools_code=""
list_tools_code=""

classify_failure() {
  local code="$1"
  if [ "${code}" = "000" ] || [ "${code}" = "000000" ]; then
    echo "DNS/routing issue (host unreachable, TLS/connectivity, or ingress path not ready)."
    return
  fi
  if [ "${code}" = "401" ] || [ "${code}" = "403" ]; then
    echo "Auth issue (missing/invalid PAM_AUTH_TOKEN for protected endpoints)."
    return
  fi
  if [ "${code}" -ge 500 ] 2>/dev/null; then
    echo "Backend issue (PAM reachable through ingress but returning server errors)."
    return
  fi
  echo "Check ingress rule/path mapping and endpoint expectations."
}

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

  local curl_args=(-sS -o /dev/null -w "%{http_code}" -X "${method}")
  if [ "${#auth_args[@]}" -gt 0 ]; then
    curl_args+=("${auth_args[@]}")
  fi
  if [ "${#extra[@]}" -gt 0 ]; then
    curl_args+=("${extra[@]}")
  fi
  curl_args+=("${BASE_URL}${path}")

  local code
  code="$(curl "${curl_args[@]}" || echo "000")"

  if [ "${code}" -ge 200 ] && [ "${code}" -lt 300 ]; then
    echo "PASS ${name} (${code})"
  else
    echo "FAIL ${name} (${code})"
    pass=0
  fi

  case "${name}" in
    "GET /health") health_code="${code}" ;;
    "GET /tools") tools_code="${code}" ;;
    "POST /tool/list_tools") list_tools_code="${code}" ;;
  esac
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
  echo "Failure classification:"
  echo "- /health: $(classify_failure "${health_code:-000}")"
  echo "- /tools: $(classify_failure "${tools_code:-000}")"
  echo "- /tool/list_tools: $(classify_failure "${list_tools_code:-000}")"
  if [ -z "${TOKEN}" ]; then
    echo "Set token and retry:"
    echo "PAM_AUTH_TOKEN='<real-token>' bash scripts/verify-public-access.sh ${BASE_URL}"
  fi
  exit 1
fi
