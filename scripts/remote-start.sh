#!/usr/bin/env bash

set -euo pipefail

# Safety: this script is intended to run ON the homelab, not on your Mac.
if [ "$(uname -s)" = "Darwin" ]; then
  echo "Refusing to start PAM on macOS. Run this via: ssh homelab"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "node not found on homelab. Run: bash ~/apps/pam/scripts/remote-build.sh"
  exit 1
fi

PAM_HOST="${PAM_HOST:-127.0.0.1}"
PAM_PORT="${PAM_PORT:-3000}"
PAM_BASE_URL="${PAM_BASE_URL:-https://pam.cultofjoey.com}"
PAM_DATA_DIR="${PAM_DATA_DIR:-~/data/pam/memory}"
PAM_AUTH_TOKEN="${PAM_AUTH_TOKEN:-}"

mkdir -p "${PAM_DATA_DIR}"

cd ~/apps/pam

if command -v pm2 >/dev/null 2>&1; then
  # pm2 mode
  if pm2 describe pam >/dev/null 2>&1; then
    env PAM_HOST="${PAM_HOST}" \
      PAM_PORT="${PAM_PORT}" \
      PAM_BASE_URL="${PAM_BASE_URL}" \
      PAM_DATA_DIR="${PAM_DATA_DIR}" \
      PAM_AUTH_TOKEN="${PAM_AUTH_TOKEN}" \
      pm2 restart pam --update-env >/dev/null
  else
    env PAM_HOST="${PAM_HOST}" \
      PAM_PORT="${PAM_PORT}" \
      PAM_BASE_URL="${PAM_BASE_URL}" \
      PAM_DATA_DIR="${PAM_DATA_DIR}" \
      PAM_AUTH_TOKEN="${PAM_AUTH_TOKEN}" \
      pm2 start node --name pam -- dist/server/httpServer.js >/dev/null
  fi
  pm2 save >/dev/null 2>&1 || true
else
  # pidfile mode (simple, scriptable)
  RUN_DIR="${HOME}/run/pam"
  mkdir -p "${RUN_DIR}"
  PIDFILE="${RUN_DIR}/pam.pid"
  LOGFILE="${RUN_DIR}/pam.log"

  if [ -f "${PIDFILE}" ]; then
    OLD_PID="$(cat "${PIDFILE}" || true)"
    if [ -n "${OLD_PID}" ] && kill -0 "${OLD_PID}" >/dev/null 2>&1; then
      kill "${OLD_PID}" >/dev/null 2>&1 || true
    fi
  fi

  env PAM_HOST="${PAM_HOST}" \
    PAM_PORT="${PAM_PORT}" \
    PAM_BASE_URL="${PAM_BASE_URL}" \
    PAM_DATA_DIR="${PAM_DATA_DIR}" \
    PAM_AUTH_TOKEN="${PAM_AUTH_TOKEN}" \
    nohup node dist/server/httpServer.js >"${LOGFILE}" 2>&1 &

  echo $! > "${PIDFILE}"
fi

echo "✔ PAM started on remote (data: ${PAM_DATA_DIR})"

