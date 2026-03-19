# Remote VM Bootstrap Plan

## Phase 1: First-Time VM Bootstrap

1. Access the VM as `root` (console login or root SSH).
2. Install your operator SSH public key on the VM (`authorized_keys`).
3. Create runtime directories:
   - `/opt/pam/app`
   - `/srv/pam/memory`
   - `/srv/pam/backups`
4. Confirm the deployment target identity:
   - direct target: `root@<vm-ip>`
   - optional SSH alias: `pam-vm` in `~/.ssh/config`

## Phase 2: Normal Remote Deployments

1. Sync source from Mac to VM app path with `rsync` (exclude local artifacts).
2. Build on VM only (install deps + `npm run build` on remote host).
3. Start/restart PAM service on VM (`systemd`).
4. Run smoke test against VM runtime.

## Operating Model

- Local Mac is source/editor only.
- Remote VM handles build and runtime.
- Persistent memory stays on VM at `/srv/pam/memory`.
