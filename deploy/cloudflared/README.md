# Cloudflared Guidance For PAM

Target hostname: `pam.cultofjoey.com`

## Case A: Existing tunnel already fronts Traefik

If cloudflared already forwards traffic to Traefik (catch-all), no new tunnel is needed.

Action:
- add PAM router/service in Traefik only (`deploy/traefik/pam.dynamic.yml`).

## Case B: Tunnel uses explicit hostname ingress rules

Add a hostname rule for PAM that forwards to Traefik.

Example:
- `hostname: pam.cultofjoey.com`
- `service: http://<traefik-host-or-ip>:80`

See `deploy/cloudflared/pam-tunnel-example.yml` for a minimal template.

## Notes

- Prefer cloudflared + Traefik as primary ingress.
- Keep PAM internal to the VM; do not expose it directly to the public internet.
- If Traefik runs on another host, the cloudflared service target must be reachable from the tunnel host.
