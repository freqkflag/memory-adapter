#!/usr/bin/env bash

set -euo pipefail

cd ~/apps/pam >/dev/null 2>&1 || true

if command -v pm2 >/dev/null 2>&1; then
  pm2 stop pam >/dev/null 2>&1 || true
  pm2 delete pam >/dev/null 2>&1 || true
  echo "✔ Stopped PAM via pm2"
  exit 0
fi

RUN_DIR="${HOME}/run/pam"
PIDFILE="${RUN_DIR}/pam.pid"

if [ -f "${PIDFILE}" ]; then
  PID="$(cat "${PIDFILE}" || true)"
  if [ -n "${PID}" ] && kill -0 "${PID}" >/dev/null 2>&1; then
    kill "${PID}" >/dev/null 2>&1 || true
  fi
  rm -f "${PIDFILE}" >/dev/null 2>&1 || true
fi

echo "✔ Stopped PAM (pidfile mode)"

