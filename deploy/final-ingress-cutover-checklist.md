# Final Ingress Cutover Checklist (PAM)

Target hostname: `pam.cultofjoey.com`

1. Run domain conflict check
   - `bash scripts/check-domain-conflicts.sh`
   - proceed only if there is no `ACTIVE_CONFLICT`.

2. If needed, inspect details
   - `bash scripts/check-domain-conflicts.sh --verbose`
   - use this when output classification is unclear.

3. Verify DNS/public routing baseline
   - `bash scripts/check-public-routing.sh`
   - confirm DNS points where expected before cutover.

4. Apply Traefik route
   - start from `deploy/traefik/pam.dynamic.yml`
   - ensure backend URL is reachable from Traefik host.

5. Apply cloudflared update only if needed
   - Case A (tunnel already fronts Traefik): no new hostname rule required.
   - Case B (explicit ingress host rules): add `pam.cultofjoey.com` forwarding to Traefik.
   - reference `deploy/cloudflared/pam-tunnel-example.yml`.

6. Set real token in PAM runtime env
   - edit `/etc/pam/pam.env`
   - replace placeholder `PAM_AUTH_TOKEN=change-me`.

7. Restart PAM if env changed
   - `ssh root@192.168.12.105 "systemctl restart pam.service"`
   - `ssh root@192.168.12.105 "bash /opt/pam/app/scripts/remote-status.sh"`

8. Verify public endpoints
   - `PAM_AUTH_TOKEN='<real-token>' bash scripts/verify-public-access.sh`
   - confirm:
     - `/health`
     - `/tools`
     - `/tool/list_tools`

Troubleshooting hints:
- `WARNING: template/docs matches only` is usually safe for cutover.
- `ACTIVE_CONFLICT` is blocking and should be resolved before applying ingress changes.
- Failure triage:
  - DNS issue: `check-public-routing.sh` shows wrong/missing records.
  - Tunnel issue: cloudflared config/routing missing or not reloaded.
  - Traefik issue: host rule/backend target mismatch.
  - PAM auth issue: `/health` works but `/tools`/`/tool/list_tools` return 401.
