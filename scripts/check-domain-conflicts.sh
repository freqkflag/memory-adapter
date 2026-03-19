#!/usr/bin/env bash

set -euo pipefail

HOSTNAME_TO_CHECK="pam.cultofjoey.com"
STRICT_MODE=0
VERBOSE_MODE=0
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

active_conflicts=()
template_only=()
docs_only=()

usage() {
  cat <<'EOF'
Usage:
  bash scripts/check-domain-conflicts.sh [--hostname <value>] [--strict] [--verbose]

Defaults:
  --hostname pam.cultofjoey.com

Exit codes:
  0 = SAFE / TEMPLATE_ONLY / DOCS_ONLY
  1 = ACTIVE_CONFLICT
EOF
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --hostname)
      HOSTNAME_TO_CHECK="${2:-}"
      shift 2
      ;;
    --strict)
      STRICT_MODE=1
      shift
      ;;
    --verbose)
      VERBOSE_MODE=1
      shift
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

if [ -z "${HOSTNAME_TO_CHECK}" ]; then
  echo "--hostname cannot be empty" >&2
  exit 1
fi

add_active_conflict() {
  active_conflicts+=("$1")
}

add_template_only() {
  template_only+=("$1")
}

add_docs_only() {
  docs_only+=("$1")
}

extract_path_from_rg_line() {
  local line="$1"
  printf '%s' "${line}" | cut -d: -f1
}

print_unique_paths() {
  if [ "$#" -eq 0 ]; then
    echo "- none"
    return
  fi
  printf '%s\n' "$@" | awk '!seen[$0]++' | sort | sed 's#^#- #'
}

print_section() {
  local title="$1"
  shift
  local items=("$@")
  if [ "${#items[@]}" -eq 0 ]; then
    return
  fi
  echo "[${title}]"
  print_unique_paths "${items[@]}"
  echo
}

classify_repo_path() {
  local rel="$1"
  local path="$2"
  local content="$3"

  if [[ "${rel}" == docs/* ]] || [[ "${rel}" == */README.md ]] || [[ "${rel}" == *.md ]]; then
    add_docs_only "${path}"
    return
  fi

  if [[ "${rel}" == examples/* ]] || [[ "${rel}" == deploy/* ]] || [[ "${rel}" == *".example"* ]] || [[ "${rel}" == *".sample"* ]] || [[ "${rel}" == *template* ]]; then
    if [ "${STRICT_MODE}" -eq 1 ] && printf '%s' "${content}" | rg -qi "Host\\(|server_name|hostname:"; then
      add_active_conflict "${path} (strict mode: template-like ingress rule)"
    else
      add_template_only "${path}"
    fi
    return
  fi

  if printf '%s' "${content}" | rg -qi "Host\\(|server_name|hostname:"; then
    add_active_conflict "${path} (runtime-like host rule)"
  else
    add_template_only "${path}"
  fi
}

echo "Checking hostname: ${HOSTNAME_TO_CHECK}"
echo

echo "1) Repo file matches"
repo_lines="$(
  rg -n "${HOSTNAME_TO_CHECK}" \
    --glob "!node_modules/**" \
    "${REPO_ROOT}" || true
)"
if [ -n "${repo_lines}" ]; then
  while IFS= read -r line; do
    [ -n "${line}" ] || continue
    rel_path="$(printf '%s' "${line}" | sed -E 's#^'"${REPO_ROOT//\//\\/}"'/?##' | cut -d: -f1)"
    abs_path="$(extract_path_from_rg_line "${line}")"
    content="$(printf '%s' "${line}" | cut -d: -f3-)"
    classify_repo_path "${rel_path}" "${abs_path}" "${content}"
  done <<EOF
${repo_lines}
EOF
fi
if [ "${VERBOSE_MODE}" -eq 1 ]; then
  if [ -n "${repo_lines}" ]; then
    echo "Repo raw matches:"
    echo "${repo_lines}"
  else
    echo "Repo raw matches: none"
  fi
  echo
fi
echo

echo "2) Runtime signals"
if command -v docker >/dev/null 2>&1; then
  echo "- docker present"
  if [ "${VERBOSE_MODE}" -eq 1 ]; then
    docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}' || true
  fi
  docker ps -q | while IFS= read -r cid; do
    [ -n "${cid}" ] || continue
    labels="$(docker inspect -f '{{json .Config.Labels}}' "${cid}" 2>/dev/null || true)"
    if printf '%s' "${labels}" | rg -qi "${HOSTNAME_TO_CHECK}"; then
      name="$(docker inspect -f '{{.Name}}' "${cid}" | sed 's#^/##')"
      add_active_conflict "docker:${name} labels reference ${HOSTNAME_TO_CHECK}"
    elif printf '%s' "${labels}" | rg -qi "traefik\\.http\\.routers.*rule.*Host\\(" && [ "${STRICT_MODE}" -eq 1 ]; then
      name="$(docker inspect -f '{{.Name}}' "${cid}" | sed 's#^/##')"
      add_active_conflict "docker:${name} has Traefik host router labels (strict mode)"
    fi
  done
else
  echo "- docker not available"
fi
echo

if command -v systemctl >/dev/null 2>&1; then
  units="$(systemctl list-units --type=service --all | rg -Ei 'traefik|cloudflared|nginx|caddy' || true)"
  if [ -n "${units}" ]; then
    echo "- ingress services detected"
    if [ "${VERBOSE_MODE}" -eq 1 ]; then
      echo "${units}"
    fi
  else
    echo "- ingress services not detected"
  fi
else
  echo "- systemctl not available"
fi
echo

if command -v ss >/dev/null 2>&1; then
  listeners="$(ss -tulnp | rg ':(80|443)\b' || true)"
  if [ -n "${listeners}" ]; then
    echo "- listeners on 80/443 detected"
    if [ "${VERBOSE_MODE}" -eq 1 ]; then
      echo "${listeners}"
    fi
  else
    echo "- no listeners on 80/443 detected"
  fi
else
  echo "- ss not available"
fi
echo

echo "3) Optional live config path checks"
for cfg_dir in /etc/traefik /etc/cloudflared /etc/nginx /etc/caddy; do
  if [ -d "${cfg_dir}" ]; then
    cfg_hits="$(rg -n "${HOSTNAME_TO_CHECK}" "${cfg_dir}" 2>/dev/null || true)"
    if [ -n "${cfg_hits}" ]; then
      add_active_conflict "live-config:${cfg_dir} contains ${HOSTNAME_TO_CHECK}"
      echo "- ${cfg_dir}: hostname matches found"
      if [ "${VERBOSE_MODE}" -eq 1 ]; then
        echo "${cfg_hits}"
      fi
    else
      echo "- ${cfg_dir}: present, no hostname matches"
    fi
  else
    echo "- ${cfg_dir}: not present"
  fi
done
echo

print_section "ACTIVE_CONFLICT" "${active_conflicts[@]}"
print_section "TEMPLATE_ONLY" "${template_only[@]}"
print_section "DOCS_ONLY" "${docs_only[@]}"

active_count="$(printf '%s\n' "${active_conflicts[@]:-}" | awk 'NF' | awk '!seen[$0]++' | wc -l | tr -d ' ')"
template_count="$(printf '%s\n' "${template_only[@]:-}" | awk 'NF' | awk '!seen[$0]++' | wc -l | tr -d ' ')"
docs_count="$(printf '%s\n' "${docs_only[@]:-}" | awk 'NF' | awk '!seen[$0]++' | wc -l | tr -d ' ')"

echo "Summary:"
echo "- Active conflicts: ${active_count}"
echo "- Template/example matches: ${template_count}"
echo "- Docs-only matches: ${docs_count}"
echo

if [ "${#active_conflicts[@]}" -gt 0 ]; then
  echo "Final status:"
  echo "CONFLICT: active runtime conflict detected"
  exit 1
fi

if [ "${#template_only[@]}" -gt 0 ] || [ "${#docs_only[@]}" -gt 0 ]; then
  echo "Final status:"
  echo "WARNING: template/docs matches only"
  exit 0
else
  echo "[SAFE]"
  echo "- No active conflicts detected"
  echo
  echo "Final status:"
  echo "SAFE: no active conflicts found"
  exit 0
fi
