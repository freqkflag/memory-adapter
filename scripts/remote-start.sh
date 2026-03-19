#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=./lib-remote-env.sh
source "${SCRIPT_DIR}/lib-remote-env.sh"
load_remote_defaults

SERVICE_NAME="${PAM_SERVICE_NAME:-pam.service}"
ENV_FILE="${PAM_ENV_FILE:-/etc/pam/pam.env}"

if [ "$(uname -s)" = "Darwin" ]; then
  echo "remote-start.sh must run on the remote VM."
  exit 1
fi

if [ ! -d "${PAM_REMOTE_APP_DIR}" ]; then
  echo "Missing app dir: ${PAM_REMOTE_APP_DIR}"
  exit 1
fi

mkdir -p "${PAM_REMOTE_DATA_DIR}"

if [ ! -f "${ENV_FILE}" ]; then
  echo "Missing env file: ${ENV_FILE}"
  echo "Create from template: ${PAM_REMOTE_APP_DIR}/deploy/pam.env.example"
  exit 1
fi

if ! command -v systemctl >/dev/null 2>&1; then
  echo "systemctl not found on remote VM."
  exit 1
fi

SYSTEMCTL_CMD=(systemctl)
if [ "$(id -u)" -ne 0 ]; then
  if command -v sudo >/dev/null 2>&1; then
    SYSTEMCTL_CMD=(sudo systemctl)
  else
    echo "systemctl requires root privileges or sudo access."
    exit 1
  fi
fi

"${SYSTEMCTL_CMD[@]}" daemon-reload
"${SYSTEMCTL_CMD[@]}" restart "${SERVICE_NAME}"
"${SYSTEMCTL_CMD[@]}" --no-pager --full status "${SERVICE_NAME}" || true

echo "✔ PAM service restarted (${SERVICE_NAME})"
echo "  App dir: ${PAM_REMOTE_APP_DIR}"
echo "  Data dir: ${PAM_REMOTE_DATA_DIR}"

