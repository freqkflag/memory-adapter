#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=./lib-remote-env.sh
source "${SCRIPT_DIR}/lib-remote-env.sh"
load_remote_defaults

ALIAS_NAME="${PAM_REMOTE_SSH_ALIAS:-pam-vm}"

cat <<EOF
Host ${ALIAS_NAME}
  HostName ${PAM_REMOTE_HOST}
  User ${PAM_REMOTE_USER}
EOF
