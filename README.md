# freqkflag Neon Repo Template

This repository defines the **standard neon README template** used across the freqkflag ecosystem.

## What this repo contains

- `templates/README_NEON.md`  
  The actual README template used for new repos. It includes placeholders:
  - `{{REPO_NAME}}`
  - `{{REPO_SLUG}}`
  - `{{OWNER}}`
  - `{{TAGLINE}}`
  - `{{SERVICE_TYPE}}`
  - `{{PHASE_STATUS}}`
  - `{{OVERVIEW}}`
  - `{{COMPONENT_1}}` … `{{COMPONENT_3}}`

- `scripts/freq-init.sh`  
  A helper script you can use (or adapt) to bootstrap a new repo locally from this template.

## Using this as a GitHub template

1. Go to **Settings → Template repository** and enable it.
2. When creating a new repo, click **"Use this template"**.
3. Optionally, also run `scripts/freq-init.sh` in new projects to fill placeholders automatically.

This repo should stay **small, stable, and easy to reason about**.
