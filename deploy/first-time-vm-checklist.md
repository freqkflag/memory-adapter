# First-Time VM Deployment Checklist

This flow is remote-first:
- Local Mac is for editing and syncing source.
- VM does build + runtime.
- Persistent data stays on VM at `/srv/pam/memory`.

## 1) Generate SSH key (if missing)

```bash
test -f ~/.ssh/id_ed25519.pub || ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -C "pam-operator"
```

## 2) Configure deploy env

```bash
cp scripts/deploy.env.example scripts/deploy.env
```

Set values in `scripts/deploy.env` (example VM):
- `PAM_REMOTE_HOST=192.168.12.105`
- `PAM_REMOTE_USER=root`
- `PAM_REMOTE_APP_DIR=/opt/pam/app`
- `PAM_REMOTE_DATA_DIR=/srv/pam/memory`
- `PAM_BASE_URL=https://pam.cultofjoey.com`
- optional `PAM_REMOTE_SSH_ALIAS=pam-vm`

## 3) Install SSH key on VM

```bash
bash scripts/bootstrap-vm-ssh.sh --host 192.168.12.105 --user root --pubkey ~/.ssh/id_ed25519.pub
```

## 4) First remote directory prep

```bash
ssh root@192.168.12.105 "bash -s" < scripts/bootstrap-vm-remote.sh
```

## 5) First rsync to new VM

```bash
bash scripts/deploy-remote.sh
```

## 6) Remote build

```bash
ssh root@192.168.12.105 "bash /opt/pam/app/scripts/remote-build.sh"
```

## 7) Edit runtime env on VM

```bash
ssh root@192.168.12.105 "sudo editor /etc/pam/pam.env"
```

Required runtime value:
- `PAM_DATA_DIR=/srv/pam/memory`

## 8) Start service

```bash
ssh root@192.168.12.105 "bash /opt/pam/app/scripts/remote-start.sh"
```

## 9) Run smoke test

```bash
ssh root@192.168.12.105 "bash /opt/pam/app/scripts/remote-smoke-test.sh"
```

## Optional one-command first-time setup

```bash
bash scripts/first-time-vm-setup.sh
```

## Optional SSH alias in `~/.ssh/config`

```sshconfig
Host pam-vm
  HostName 192.168.12.105
  User root
```
