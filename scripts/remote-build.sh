#!/usr/bin/env bash

set -euo pipefail

cd ~/apps/pam

# Deploy build must happen on the homelab.
# The homelab may not have Node/npm in PATH for non-interactive shells.
# Install Node 20 on-demand via NodeSource if missing.
if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Installing Node.js 20 on remote (missing node/npm)..."
  if command -v apt-get >/dev/null 2>&1; then
    export DEBIAN_FRONTEND=noninteractive
    apt-get update
    apt-get install -y curl ca-certificates gnupg
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
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

echo "✔ Built PAM on remote: ~/apps/pam"

