#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# shellcheck source=./lib-remote-env.sh
source "${SCRIPT_DIR}/lib-remote-env.sh"
load_remote_defaults

ssh "${PAM_REMOTE_TARGET}" "mkdir -p '${PAM_REMOTE_APP_DIR}' '${PAM_REMOTE_DATA_DIR}'"

echo "Syncing source to ${PAM_REMOTE_TARGET}:${PAM_REMOTE_APP_DIR}"
rsync -az \
  --exclude "node_modules/" \
  --exclude "dist/" \
  --exclude "coverage/" \
  --exclude ".git/" \
  --exclude ".vite/" \
  --exclude "memory/" \
  --exclude "test-output/" \
  --exclude "tests/**/output*/" \
  --exclude "*.log" \
  -e "ssh" \
  "${REPO_ROOT}/" "${PAM_REMOTE_TARGET}:${PAM_REMOTE_APP_DIR}/"

echo "✔ Synced repo to ${PAM_REMOTE_TARGET}:${PAM_REMOTE_APP_DIR}"
