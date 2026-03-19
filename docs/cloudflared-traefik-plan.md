# Cloudflared + Traefik Ingress Plan (PAM)

Preferred ingress path:

Internet
-> Cloudflare Tunnel
-> Traefik
-> PAM (`127.0.0.1:3000` on the PAM VM)

Why this path is preferred:
- Reuses the existing homelab edge stack (no extra proxy layer to operate).
- Keeps TLS/hostname routing centralized in Cloudflare + Traefik.
- Avoids introducing a second standalone reverse proxy for PAM.

Operational model:
- PAM stays bound internally on the VM.
- Public hostname `pam.cultofjoey.com` is routed at ingress.
- PAM bearer token remains enforced at the app layer.

Fallback only:
- `deploy/caddyfile.example` and `deploy/nginx.conf.example` remain as standalone examples when Traefik is unavailable.
