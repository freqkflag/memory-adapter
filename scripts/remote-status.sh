#!/usr/bin/env bash

set -euo pipefail

cd ~/apps/pam >/dev/null 2>&1 || true

if command -v pm2 >/dev/null 2>&1; then
  if pm2 describe pam >/dev/null 2>&1; then
    pm2 describe pam || true
  else
    echo "PAM not running (pm2: no process named 'pam')"
  fi
  exit 0
fi

RUN_DIR="${HOME}/run/pam"
PIDFILE="${RUN_DIR}/pam.pid"

if [ -f "${PIDFILE}" ]; then
  PID="$(cat "${PIDFILE}" || true)"
  if [ -n "${PID}" ] && kill -0 "${PID}" >/dev/null 2>&1; then
    echo "PAM running (pid: ${PID})"
    exit 0
  fi
fi

echo "PAM not running"

