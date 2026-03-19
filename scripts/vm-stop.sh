#!/usr/bin/env bash

set -euo pipefail

systemctl stop pam.service

echo "✔ pam.service stopped"

