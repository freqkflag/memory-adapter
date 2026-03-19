#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=./lib-remote-env.sh
source "${SCRIPT_DIR}/lib-remote-env.sh"
load_remote_defaults

SERVICE_NAME="${PAM_SERVICE_NAME:-pam.service}"

if [ "$(uname -s)" = "Darwin" ]; then
  echo "remote-stop.sh must run on the remote VM."
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

"${SYSTEMCTL_CMD[@]}" stop "${SERVICE_NAME}"
"${SYSTEMCTL_CMD[@]}" --no-pager --full status "${SERVICE_NAME}" || true

echo "✔ PAM service stopped (${SERVICE_NAME})"

