#!/usr/bin/env bash
set -euo pipefail
INPUT="$(cat)"
FILE_PATH="$(printf '%s' "$INPUT" | node -e "let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>{try{const j=JSON.parse(s),i=j.tool_input||{};process.stdout.write(String(i.file_path||i.path||''))}catch(_){}})")"
case "$FILE_PATH" in
  *.env|*/.env|*/.env.*|.env|.env.*|*credentials*|*secret*|*secrets*)
    echo "Protected file: AI edits are not allowed for $FILE_PATH" >&2
    exit 2 ;;
esac
exit 0
