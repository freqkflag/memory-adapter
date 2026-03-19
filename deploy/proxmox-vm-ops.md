## Proxmox VM ops (PAM)

### Recommended VM specs
- 2 vCPU
- 4 GB RAM
- 30–50 GB disk

### QEMU guest agent
- Enable `qemu-guest-agent` in the VM
- Start it and verify it’s running (helps with snapshots and clean shutdowns)

### Backups
- Proxmox: take VM snapshots for rollback.
- Filesystem: back up PAM data regularly:
  - `/srv/pam/memory` (use `scripts/vm-backup-memory.sh`)

### Restore
1. Stop service: `sudo systemctl stop pam.service`
2. Restore data: `scripts/vm-restore-memory.sh <archive.tar.gz> --force` (or confirm interactively)
3. Start service: `sudo systemctl start pam.service`

### Runtime locations
- App path: `/opt/pam/app`
- Persistent memory: `/srv/pam/memory`
- Backups: `/srv/pam/backups`
- Logs: journald (`journalctl -u pam.service`)

### Rotating the bearer token
1. Edit `/etc/pam/pam.env`
2. Restart: `sudo systemctl restart pam.service`

