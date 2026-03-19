#!/usr/bin/env bash

set -euo pipefail

APP_DIR="/opt/pam/app"
SERVICE_NAME="pam"
SERVICE_UNIT="${SERVICE_NAME}.service"

log() {
  echo "[$(date -Iseconds)] $*"
}

ensure_node() {
  if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
    return 0
  fi

  log "Installing Node.js 20 on VM (missing node/npm)..."
  export DEBIAN_FRONTEND=noninteractive
  apt-get update
  apt-get install -y curl ca-certificates gnupg
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
}

main() {
  if [ "$(id -u)" -ne 0 ]; then
    echo "vm-update.sh should be run as root on the VM."
    exit 1
  fi

  if [ ! -d "$APP_DIR" ]; then
    echo "Missing ${APP_DIR}. Run vm-install.sh first."
    exit 1
  fi

  ensure_node

  # Optional: update app code from an rsync source.
  # Example:
  #   PAM_SYNC_FROM="/path/to/pam/" /opt/pam/app/scripts/vm-update.sh
  # Or set PAM_SYNC_FROM to an rsync source like: user@host:/path/to/pam/
  if [ -n "${PAM_SYNC_FROM:-}" ]; then
    log "Syncing app code from PAM_SYNC_FROM=${PAM_SYNC_FROM} into ${APP_DIR}..."
    rsync -az \
      --exclude "node_modules/" \
      --exclude "dist/" \
      --exclude "coverage/" \
      --exclude ".git/" \
      --exclude ".vite/" \
      --exclude "memory/" \
      -e "ssh" \
      "${PAM_SYNC_FROM%/}/" "${APP_DIR}/"
  fi

  if [ ! -f "${APP_DIR}/package.json" ]; then
    echo "Missing ${APP_DIR}/package.json"
    exit 1
  fi

  cd "$APP_DIR"
  if [ -f package-lock.json ]; then
    npm ci --ignore-scripts
  else
    npm install --ignore-scripts
  fi

  npm run build

  # Restart safely; systemd will track failures.
  systemctl restart "${SERVICE_UNIT}"

  log "VM update complete (rebuilt + restarted ${SERVICE_UNIT})."
}

main "$@"

