#!/usr/bin/env bash

set -euo pipefail

APP_DIR="${PAM_REMOTE_APP_DIR:-/opt/pam/app}"
DATA_DIR="${PAM_REMOTE_DATA_DIR:-/srv/pam/memory}"
BACKUP_DIR="${PAM_REMOTE_BACKUP_DIR:-/srv/pam/backups}"
APP_OWNER_USER="${PAM_APP_OWNER_USER:-root}"
APP_OWNER_GROUP="${PAM_APP_OWNER_GROUP:-root}"
DATA_OWNER_USER="${PAM_DATA_OWNER_USER:-pam}"
DATA_OWNER_GROUP="${PAM_DATA_OWNER_GROUP:-pam}"

if [ "$(id -u)" -ne 0 ]; then
  echo "bootstrap-vm-remote.sh should be run as root on the VM."
  exit 1
fi

for dir in "${APP_DIR}" "${DATA_DIR}" "${BACKUP_DIR}"; do
  mkdir -p "${dir}"
done

if ! id "${DATA_OWNER_USER}" >/dev/null 2>&1; then
  DATA_OWNER_USER="root"
  DATA_OWNER_GROUP="root"
fi

if command -v chown >/dev/null 2>&1; then
  chown "${APP_OWNER_USER}:${APP_OWNER_GROUP}" "${APP_DIR}" || true
  chown "${DATA_OWNER_USER}:${DATA_OWNER_GROUP}" "${DATA_DIR}" "${BACKUP_DIR}" || true
fi

chmod 755 "${APP_DIR}"
chmod 750 "${DATA_DIR}" "${BACKUP_DIR}"

echo "✔ VM directory bootstrap complete"
ls -ld "${APP_DIR}" "${DATA_DIR}" "${BACKUP_DIR}"
