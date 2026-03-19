# Traefik Docker Labels (Example)

Use this when PAM is containerized and Traefik discovers routes from container labels.

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.pam.rule=Host(`pam.cultofjoey.com`)"
  - "traefik.http.routers.pam.entrypoints=websecure"
  - "traefik.http.routers.pam.tls=true"
  - "traefik.http.services.pam.loadbalancer.server.port=3000"
```

For the current VM/systemd PAM deployment, prefer file-provider config such as `deploy/traefik/pam.dynamic.yml`.

If Traefik runs on another host, point Traefik to the PAM VM IP/DNS (`192.168.12.105:3000` or internal DNS equivalent).
