#!/usr/bin/env bash

set -euo pipefail

REMOTE_HOST="homelab"
REMOTE_PATH="~/apps/pam"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

REMOTE_PATH_ABS="$(ssh "${REMOTE_HOST}" 'echo "$HOME/apps/pam"')"
ssh "${REMOTE_HOST}" "mkdir -p \"${REMOTE_PATH_ABS}\""

rsync -az \
  --exclude "node_modules/" \
  --exclude "dist/" \
  --exclude "coverage/" \
  --exclude ".git/" \
  --exclude ".vite/" \
  --exclude "test-output/" \
  --exclude "tests/**/output*/" \
  -e "ssh" \
  "${REPO_ROOT}/" "${REMOTE_HOST}:${REMOTE_PATH_ABS}/"

echo "✔ Synced repo to ${REMOTE_HOST}:${REMOTE_PATH_ABS}"

