#!/usr/bin/env bash

set -euo pipefail

HOST=""
USER="root"
PUBKEY_PATH="${HOME}/.ssh/id_ed25519.pub"

usage() {
  cat <<'EOF'
Usage: scripts/bootstrap-vm-ssh.sh --host <ip-or-hostname> [--user <remote-user>] [--pubkey <path>]

Defaults:
  --user   root
  --pubkey ~/.ssh/id_ed25519.pub
EOF
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --host)
      HOST="${2:-}"
      shift 2
      ;;
    --user)
      USER="${2:-}"
      shift 2
      ;;
    --pubkey)
      PUBKEY_PATH="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [ -z "${HOST}" ]; then
  echo "--host is required." >&2
  usage
  exit 1
fi

if [ ! -f "${PUBKEY_PATH}" ]; then
  echo "Public key not found: ${PUBKEY_PATH}" >&2
  exit 1
fi

PUBKEY_CONTENT="$(<"${PUBKEY_PATH}")"
if [ -z "${PUBKEY_CONTENT}" ]; then
  echo "Public key file is empty: ${PUBKEY_PATH}" >&2
  exit 1
fi

echo "Installing this public key on ${USER}@${HOST}:"
echo "${PUBKEY_CONTENT}"

ssh "${USER}@${HOST}" "bash -s" <<'EOF'
set -euo pipefail
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"
touch "$HOME/.ssh/authorized_keys"
chmod 600 "$HOME/.ssh/authorized_keys"
EOF

ssh "${USER}@${HOST}" "bash -s --" "${PUBKEY_CONTENT}" <<'EOF'
set -euo pipefail
pubkey="$1"
auth_file="$HOME/.ssh/authorized_keys"
if ! grep -Fqx -- "$pubkey" "$auth_file"; then
  printf '%s\n' "$pubkey" >> "$auth_file"
fi
chmod 600 "$auth_file"
EOF

echo "✔ SSH key install complete."
echo "Test with:"
echo "ssh ${USER}@${HOST}"
