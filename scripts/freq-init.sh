#!/usr/bin/env bash

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <repo-slug> [tagline] [service_type] [phase_status]"
  exit 1
fi

REPO_SLUG="$1"
TAGLINE="${2:-Neon service in the freqkflag ecosystem}"
SERVICE_TYPE="${3:-service}"
PHASE_STATUS="${4:-PHASE-00 | DRAFT}"
OWNER="freqkflag"

REPO_NAME="$(echo "$REPO_SLUG" | tr '-' ' ' | sed 's/\b\(.\)/\u\1/g')"

WORKDIR="$PWD/$REPO_SLUG"

echo "✨ Bootstrapping repo '$REPO_SLUG' in $WORKDIR"

mkdir -p "$WORKDIR"
cd "$WORKDIR"

# Initialize repo if not already initialized
if [ ! -d .git ]; then
  git init -b main
fi

# Fetch the template README from neon-repo-template main branch
TEMPLATE_URL="https://raw.githubusercontent.com/$OWNER/neon-repo-template/main/templates/README_NEON.md"

echo "📥 Fetching template from $TEMPLATE_URL"

curl -fsSL "$TEMPLATE_URL" -o README.md

# Perform placeholder substitution (GNU sed assumed)
sed -i.bak \
  -e "s/{{REPO_NAME}}/$REPO_NAME/g" \
  -e "s/{{REPO_SLUG}}/$REPO_SLUG/g" \
  -e "s/{{OWNER}}/$OWNER/g" \
  -e "s/{{TAGLINE}}/$TAGLINE/g" \
  -e "s/{{SERVICE_TYPE}}/$SERVICE_TYPE/g" \
  -e "s/{{PHASE_STATUS}}/$PHASE_STATUS/g" \
  -e "s/{{OVERVIEW}}/TODO: Write an overview for $REPO_NAME./g" \
  -e "s/{{COMPONENT_1}}/TODO: Component 1/g" \
  -e "s/{{COMPONENT_2}}/TODO: Component 2/g" \
  -e "s/{{COMPONENT_3}}/TODO: Component 3/g" \
  README.md

rm README.md.bak

echo "✅ Neon README created for $REPO_SLUG"
echo
echo "Next steps (manual):"
echo "  cd $WORKDIR"
echo "  git add README.md"
echo "  git commit -m \"chore: bootstrap $REPO_SLUG from neon template\""
echo "  gh repo create $OWNER/$REPO_SLUG --source=. --public --push   # or --private"

