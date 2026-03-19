#!/usr/bin/env bash

set -euo pipefail

systemctl start pam.service

echo "✔ pam.service started"

