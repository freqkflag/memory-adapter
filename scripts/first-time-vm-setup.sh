#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=./lib-remote-env.sh
source "${SCRIPT_DIR}/lib-remote-env.sh"
load_remote_defaults

if [ "$(uname -s)" != "Darwin" ]; then
  echo "first-time-vm-setup.sh is intended to run from your local Mac."
fi

PUBKEY_PATH="${PAM_BOOTSTRAP_PUBKEY:-${HOME}/.ssh/id_ed25519.pub}"

if [ -z "${PAM_REMOTE_HOST:-}" ]; then
  echo "PAM_REMOTE_HOST is required for first-time key install."
  exit 1
fi

echo "1/4 Installing local SSH public key on remote VM..."
bash "${SCRIPT_DIR}/bootstrap-vm-ssh.sh" \
  --host "${PAM_REMOTE_HOST}" \
  --user "${PAM_REMOTE_USER}" \
  --pubkey "${PUBKEY_PATH}"

echo "2/4 Preparing remote VM directories..."
ssh "${PAM_REMOTE_TARGET}" \
  "PAM_REMOTE_APP_DIR='${PAM_REMOTE_APP_DIR}' PAM_REMOTE_DATA_DIR='${PAM_REMOTE_DATA_DIR}' bash -s" \
  < "${SCRIPT_DIR}/bootstrap-vm-remote.sh"

echo "3/4 Syncing repository source to VM app dir..."
bash "${SCRIPT_DIR}/deploy-remote.sh"

echo "4/4 Next commands:"
echo
echo "ssh ${PAM_REMOTE_TARGET} \"bash '${PAM_REMOTE_APP_DIR}/scripts/remote-build.sh'\""
echo "ssh ${PAM_REMOTE_TARGET} \"sudo editor /etc/pam/pam.env\""
echo "ssh ${PAM_REMOTE_TARGET} \"bash '${PAM_REMOTE_APP_DIR}/scripts/remote-start.sh'\""
echo "ssh ${PAM_REMOTE_TARGET} \"bash '${PAM_REMOTE_APP_DIR}/scripts/remote-smoke-test.sh'\""
