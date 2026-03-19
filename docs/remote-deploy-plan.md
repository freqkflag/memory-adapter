## STEP 0 — REMOTE-FIRST DEPLOYMENT PLAN

Local machine role: source repo only (no production build/run on Mac).

Remote host role: build + runtime.

Target remote path: `~/apps/pam`

Persistent data path on remote: `~/data/pam/memory`

Reverse proxy target: `pam.cultofjoey.com`

Auth model: bearer token via `PAM_AUTH_TOKEN`

Deployment flow (remote-first):
1. `rsync` local repo to remote over `ssh homelab`
2. build on remote
3. run on remote
4. reverse proxy to PAM service

