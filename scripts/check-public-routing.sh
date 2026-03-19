#!/usr/bin/env bash

set -euo pipefail

HOSTNAME_TO_CHECK="${1:-pam.cultofjoey.com}"

echo "Checking DNS for ${HOSTNAME_TO_CHECK}"
echo

if command -v dig >/dev/null 2>&1; then
  cname_records="$(dig +short CNAME "${HOSTNAME_TO_CHECK}" || true)"
  a_records="$(dig +short A "${HOSTNAME_TO_CHECK}" || true)"
  aaaa_records="$(dig +short AAAA "${HOSTNAME_TO_CHECK}" || true)"
elif command -v nslookup >/dev/null 2>&1; then
  cname_records=""
  a_records="$(nslookup "${HOSTNAME_TO_CHECK}" 2>/dev/null | awk '/^Address: / {print $2}' | tail -n +2 || true)"
  aaaa_records=""
else
  echo "Neither dig nor nslookup is available."
  exit 1
fi

echo "CNAME:"
if [ -n "${cname_records}" ]; then
  echo "${cname_records}"
else
  echo "(none)"
fi
echo

echo "A records:"
if [ -n "${a_records}" ]; then
  echo "${a_records}"
else
  echo "(none)"
fi
echo

echo "AAAA records:"
if [ -n "${aaaa_records}" ]; then
  echo "${aaaa_records}"
else
  echo "(none)"
fi
echo

appears_cloudflare="no"
if printf '%s\n' "${cname_records}" | rg -qi 'cfargotunnel\.com'; then
  appears_cloudflare="yes (CNAME points to Cloudflare Tunnel)"
elif printf '%s\n%s\n' "${a_records}" "${aaaa_records}" | rg -q '^(104\.|172\.(6[4-9]|7[0-1])\.|188\.114\.|190\.93\.|198\.41\.)'; then
  appears_cloudflare="likely (IP range heuristic)"
fi

echo "Cloudflare proxy assessment: ${appears_cloudflare}"
