#!/usr/bin/env bash
set -euo pipefail
hookPath="$(cd "$(dirname "$0")" && pwd)/git-hooks"
git config core.hooksPath "$hookPath"
node "$hookPath/../update-readme-branches.mjs"
