#!/usr/bin/env bash

set -euo pipefail

systemctl status pam.service --no-pager -l

