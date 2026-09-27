#!/usr/bin/env bash
set -euo pipefail
INPUT="$(cat)"
FILE_PATH="$(printf '%s' "$INPUT" | node -e "let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>{try{const j=JSON.parse(s),i=j.tool_input||{};process.stdout.write(String(i.file_path||i.path||''))}catch(_){}})")"
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.json|*.md|*.css)
    [ ! -f "$FILE_PATH" ] || npx prettier --write "$FILE_PATH" >/dev/null 2>&1 || true ;;
esac
exit 0
