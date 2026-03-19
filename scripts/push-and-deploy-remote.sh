#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=./lib-remote-env.sh
source "${SCRIPT_DIR}/lib-remote-env.sh"
load_remote_defaults

echo "1/4 Syncing repo to remote..."
bash "${SCRIPT_DIR}/deploy-remote.sh"

echo "2/4 Building on remote VM..."
ssh "${PAM_REMOTE_TARGET}" "bash '${PAM_REMOTE_APP_DIR}/scripts/remote-build.sh'"

echo "3/4 Restarting service on remote VM..."
ssh "${PAM_REMOTE_TARGET}" "bash '${PAM_REMOTE_APP_DIR}/scripts/remote-start.sh'"

echo "4/4 Running smoke test on remote VM..."
ssh "${PAM_REMOTE_TARGET}" "bash '${PAM_REMOTE_APP_DIR}/scripts/remote-smoke-test.sh'"

echo "✔ Remote deploy completed."
ssh "${PAM_REMOTE_TARGET}" "bash '${PAM_REMOTE_APP_DIR}/scripts/remote-status.sh'" || true
