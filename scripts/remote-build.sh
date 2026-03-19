#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=./lib-remote-env.sh
source "${SCRIPT_DIR}/lib-remote-env.sh"
load_remote_defaults

if [ "$(uname -s)" = "Darwin" ]; then
  echo "remote-build.sh must run on the remote VM, not on macOS."
  exit 1
fi

if [ ! -f "${PAM_REMOTE_APP_DIR}/package.json" ]; then
  echo "Missing ${PAM_REMOTE_APP_DIR}/package.json on remote VM."
  echo "Sync code first: bash scripts/deploy-remote.sh"
  exit 1
fi

cd "${PAM_REMOTE_APP_DIR}"

SUDO_CMD=""
if [ "$(id -u)" -ne 0 ]; then
  if command -v sudo >/dev/null 2>&1; then
    SUDO_CMD="sudo"
  fi
fi

# Remote build must happen on the VM only.
# Install Node 20 on-demand when missing.
if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Installing Node.js 20 on remote (missing node/npm)..."
  if command -v apt-get >/dev/null 2>&1; then
    export DEBIAN_FRONTEND=noninteractive
    if [ -n "${SUDO_CMD}" ]; then
      ${SUDO_CMD} apt-get update
      ${SUDO_CMD} apt-get install -y curl ca-certificates gnupg
      curl -fsSL https://deb.nodesource.com/setup_20.x | ${SUDO_CMD} bash -
      ${SUDO_CMD} apt-get install -y nodejs
    else
      apt-get update
      apt-get install -y curl ca-certificates gnupg
      curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
      apt-get install -y nodejs
    fi
  else
    echo "No supported package manager found on remote; install Node.js manually."
    exit 1
  fi
fi
# Skip scripts because this repo's `postinstall` depends on `dist/`,
# which we create via `npm run build` below.
if [ -f package-lock.json ]; then
  npm ci --ignore-scripts
else
  npm install --ignore-scripts
fi

npm run build

echo "✔ Build complete on remote VM"
echo "  App dir: ${PAM_REMOTE_APP_DIR}"
echo "  Node: $(node -v)"
echo "  NPM:  $(npm -v)"

