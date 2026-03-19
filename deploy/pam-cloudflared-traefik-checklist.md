# PAM Cloudflared + Traefik Checklist

Use this as the primary ingress path for `pam.cultofjoey.com`.

1. Verify no existing route conflict
   - `bash scripts/check-domain-conflicts.sh`
   - default output is concise path-only.
   - use `--verbose` for line-level match details and deeper diagnostics.
   - `ACTIVE_CONFLICT` is blocking and must be resolved first.
   - `TEMPLATE_ONLY` is expected for example files and is not blocking.
   - `DOCS_ONLY` is expected for docs/checklists and is not blocking.
   - use `--strict` if you want conservative handling of ambiguous template/runtime files.

2. Add/merge Traefik route for PAM
   - start from `deploy/traefik/pam.dynamic.yml`
   - set backend to PAM VM reachable target (`192.168.12.105:3000` or internal DNS).

3. Ensure cloudflared forwards hostname to Traefik (if needed)
   - if tunnel already fronts Traefik globally, no new hostname tunnel rule is needed.
   - if tunnel uses explicit hostname ingress, add `pam.cultofjoey.com` rule.
   - reference: `deploy/cloudflared/pam-tunnel-example.yml`.

4. Set real bearer token in VM env
   - edit `/etc/pam/pam.env`
   - replace `PAM_AUTH_TOKEN=change-me` with a real token.

5. Restart PAM
   - `ssh root@192.168.12.105 "systemctl restart pam.service"`
   - `ssh root@192.168.12.105 "bash /opt/pam/app/scripts/remote-status.sh"`

6. Verify external access
   - `bash scripts/check-public-routing.sh`
   - `PAM_AUTH_TOKEN='<real-token>' bash scripts/verify-public-access.sh`

Notes:
- Keep PAM bound internally (`127.0.0.1` in VM config) where possible.
- Do not expose PAM directly without ingress controls.
- PAM bearer token is the initial app-layer gate; keep it enabled.
- Caddy/Nginx examples in `deploy/` are fallback standalone options, not the primary architecture.
