#!/usr/bin/env bash

# shellcheck shell=bash

load_deploy_env() {
  local script_dir repo_root env_file
  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  repo_root="$(cd "${script_dir}/.." && pwd)"
  env_file="${PAM_DEPLOY_ENV_FILE:-${repo_root}/scripts/deploy.env}"

  if [ -f "${env_file}" ]; then
    # shellcheck disable=SC1090
    source "${env_file}"
  fi
}

require_deploy_var() {
  local var_name="$1"
  if [ -z "${!var_name:-}" ]; then
    echo "Missing required deployment variable: ${var_name}" >&2
    echo "Set it in environment or scripts/deploy.env" >&2
    exit 1
  fi
}

resolve_remote_target() {
  if [ -n "${PAM_REMOTE_SSH_ALIAS:-}" ]; then
    PAM_REMOTE_TARGET="${PAM_REMOTE_SSH_ALIAS}"
  else
    require_deploy_var "PAM_REMOTE_HOST"
    require_deploy_var "PAM_REMOTE_USER"
    PAM_REMOTE_TARGET="${PAM_REMOTE_USER}@${PAM_REMOTE_HOST}"
  fi
}

load_remote_defaults() {
  load_deploy_env

  PAM_REMOTE_HOST="${PAM_REMOTE_HOST:-}"
  PAM_REMOTE_USER="${PAM_REMOTE_USER:-root}"
  PAM_REMOTE_APP_DIR="${PAM_REMOTE_APP_DIR:-/opt/pam/app}"
  PAM_REMOTE_DATA_DIR="${PAM_REMOTE_DATA_DIR:-/srv/pam/memory}"
  PAM_BASE_URL="${PAM_BASE_URL:-https://pam.cultofjoey.com}"
  PAM_REMOTE_SSH_ALIAS="${PAM_REMOTE_SSH_ALIAS:-}"

  resolve_remote_target
}
