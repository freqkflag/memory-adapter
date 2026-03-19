#!/usr/bin/env bash

set -euo pipefail

MEMORY_DIR="/srv/pam/memory"
BACKUP_DIR="/srv/pam/backups"
SERVICE_UNIT="pam.service"

force=0

usage() {
  echo "Usage: $0 <memory_backup.tar.gz> [--force]"
  echo "Restores the selected archive into ${MEMORY_DIR}."
}

archive="${1:-}"
if [ "${archive}" = "-h" ] || [ "${archive}" = "--help" ] || [ -z "${archive}" ]; then
  usage
  exit 1
fi

if [ "${2:-}" = "--force" ]; then
  force=1
fi

if [[ ! "${archive}" =~ ^[A-Za-z0-9._-]+\.tar\.gz$ ]]; then
  echo "Invalid archive name. Refusing to restore: ${archive}"
  exit 1
fi

ARCHIVE_PATH="${BACKUP_DIR}/${archive}"
if [ ! -f "${ARCHIVE_PATH}" ]; then
  echo "Backup archive not found: ${ARCHIVE_PATH}"
  exit 1
fi

if [ "${force}" -ne 1 ]; then
  echo "About to restore: ${ARCHIVE_PATH}"
  echo "This will overwrite contents of: ${MEMORY_DIR}"
  echo "Type 'YES' to continue:"
  read -r answer
  if [ "${answer}" != "YES" ]; then
    echo "Aborting restore."
    exit 1
  fi
fi

if command -v systemctl >/dev/null 2>&1; then
  echo "Stopping ${SERVICE_UNIT}..."
  systemctl stop "${SERVICE_UNIT}" || true
fi

mkdir -p "${MEMORY_DIR}"

# Basic path traversal defense: ensure tar members are not absolute and do not contain .. segments.
echo "Validating archive contents..."
while IFS= read -r member; do
  # Skip empty lines.
  [ -z "${member}" ] && continue

  if [[ "${member}" = /* ]]; then
    echo "Archive contains absolute path entry: ${member}"
    exit 1
  fi
  if [[ "${member}" == *".."* ]]; then
    echo "Archive contains path traversal entry: ${member}"
    exit 1
  fi
done < <(tar -tzf "${ARCHIVE_PATH}")

echo "Restoring memory directory..."
rm -rf "${MEMORY_DIR}"
mkdir -p "${MEMORY_DIR}"

# Our backup archives are created from /srv/pam with the directory name `memory`,
# so extracting into /srv/pam recreates /srv/pam/memory.
tar --no-same-owner --no-same-permissions -xzf "${ARCHIVE_PATH}" -C "/srv/pam"

if command -v systemctl >/dev/null 2>&1; then
  echo "Starting ${SERVICE_UNIT}..."
  systemctl start "${SERVICE_UNIT}"
fi

echo "✔ Restore complete."

