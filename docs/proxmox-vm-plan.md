## Proxmox VM deployment plan (PAM)

### Why VM over LXC
- VMs give stronger isolation and fewer surprises from container lifecycle/network differences.
- PAM runtime is a full Node.js HTTP server; VM-level upgrades/rollback are simpler and safer for long-term ops.

### Runtime inside the VM
- PAM runs inside a Debian/Ubuntu VM as the service `pam` (systemd).
- App path inside VM: `/opt/pam/app`
- PAM data path inside VM: `/srv/pam/memory`

### Public URL + reverse proxy
- Public URL: `https://pam.cultofjoey.com`
- Preferred ingress path is Cloudflare Tunnel -> Traefik -> PAM.
- Reverse proxy forwards requests to PAM listening on `127.0.0.1:3000` inside the VM.
- Standalone Caddy/Nginx examples remain fallback options only.

### Backups strategy
- Proxmox VM snapshot backups (good for quick rollbacks).
- Filesystem backup of `/srv/pam/memory` (tar/rsync) for durable data recovery.

### QEMU guest agent
- Enable the QEMU guest agent for consistent snapshot timing and better shutdown coordination.

