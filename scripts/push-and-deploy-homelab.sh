#!/usr/bin/env bash

set -uo pipefail

REMOTE_HOST="homelab"
REMOTE_PATH="~/apps/pam"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

ok=1
REMOTE_PATH_ABS="$(ssh "${REMOTE_HOST}" 'echo "$HOME/apps/pam"')"

echo "1/3 Syncing repo to ${REMOTE_HOST}:${REMOTE_PATH}..."
if ! bash "${SCRIPT_DIR}/deploy-homelab.sh"; then
  ok=0
fi

echo "2/3 Building on remote..."
if ! ssh "${REMOTE_HOST}" "bash \"${REMOTE_PATH_ABS}/scripts/remote-build.sh\""; then
  ok=0
fi

echo "3/3 Starting on remote..."
if ! ssh "${REMOTE_HOST}" "bash \"${REMOTE_PATH_ABS}/scripts/remote-start.sh\""; then
  ok=0
fi

if [ "${ok}" -eq 1 ]; then
  echo "✔ Remote deploy completed successfully."
  ssh "${REMOTE_HOST}" "bash \"${REMOTE_PATH_ABS}/scripts/remote-status.sh\"" || true
else
  echo "✘ Remote deploy failed. Check the output above."
fi

