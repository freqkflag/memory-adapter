#!/usr/bin/env bash

set -euo pipefail

MEMORY_DIR="/srv/pam/memory"
BACKUP_DIR="/srv/pam/backups"

mkdir -p "$BACKUP_DIR"

if [ ! -d "$MEMORY_DIR" ]; then
  echo "Memory dir does not exist yet (${MEMORY_DIR}); creating empty dir before backup."
  mkdir -p "$MEMORY_DIR"
fi

TS="$(date +'%Y%m%d_%H%M%S')"
OUT="${BACKUP_DIR}/memory_${TS}.tar.gz"

tar -czf "$OUT" -C "$(dirname "$MEMORY_DIR")" "$(basename "$MEMORY_DIR")"

echo "✔ Backed up ${MEMORY_DIR} -> ${OUT}"

