#!/usr/bin/env bash

set -euo pipefail

APP_DIR="/opt/pam/app"
DATA_DIR="/srv/pam/memory"
BACKUP_DIR="/srv/pam/backups"
ENV_DIR="/etc/pam"
ENV_FILE="${ENV_DIR}/pam.env"

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

ensure_user() {
  if id pam >/dev/null 2>&1; then
    return 0
  fi

  log "Creating non-root service user 'pam'..."
  useradd --system --create-home --home-dir /home/pam --shell /usr/sbin/nologin pam
}

main() {
  if [ "$(id -u)" -ne 0 ]; then
    echo "vm-install.sh should be run as root on the VM."
    exit 1
  fi

  mkdir -p "$APP_DIR" "$DATA_DIR" "$BACKUP_DIR" "$ENV_DIR"

  # App code is expected to already be present at /opt/pam/app.
  if [ ! -f "${APP_DIR}/package.json" ]; then
    echo "Missing ${APP_DIR}/package.json. Sync/rsync PAM code to ${APP_DIR} first."
    exit 1
  fi

  ensure_user
  ensure_node

  # Prepare env file for systemd.
  if [ ! -f "$ENV_FILE" ]; then
    if [ -f "${APP_DIR}/deploy/pam.env.example" ]; then
      cp "${APP_DIR}/deploy/pam.env.example" "$ENV_FILE"
      chmod 600 "$ENV_FILE"
      log "Created ${ENV_FILE} from deploy/pam.env.example (edit PAM_AUTH_TOKEN)."
    else
      echo "Missing ${ENV_FILE} and ${APP_DIR}/deploy/pam.env.example."
      exit 1
    fi
  fi

  # Install deps + build. We use --ignore-scripts because this repo's postinstall
  # expects dist to exist; dist is produced by npm run build right after.
  cd "$APP_DIR"
  if [ -f package-lock.json ]; then
    npm ci --ignore-scripts
  else
    npm install --ignore-scripts
  fi
  npm run build

  # Install systemd unit.
  if [ -f "${APP_DIR}/deploy/pam.service" ]; then
    cp "${APP_DIR}/deploy/pam.service" "/etc/systemd/system/${SERVICE_UNIT}"
  else
    echo "Missing ${APP_DIR}/deploy/pam.service"
    exit 1
  fi

  systemctl daemon-reload
  systemctl enable "${SERVICE_UNIT}"
  systemctl restart "${SERVICE_UNIT}"

  log "PAM installed and started via systemd (${SERVICE_UNIT})."
}

main "$@"

