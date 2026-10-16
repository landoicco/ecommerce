#!/usr/bin/env bash
# PostToolUse hook: formats the file Claude just edited, using the project's own formatters.
# Reads the hook payload (JSON) from stdin. Never blocks the edit: failures are only reported.
set -uo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
file="$(jq -r '.tool_input.file_path // .tool_response.filePath // empty')"
[[ -n "$file" && -f "$file" ]] || exit 0

case "$file" in
  "$root"/backend/*.java | "$root"/backend/pom.xml)
    # Spotless takes regexes matched against absolute paths; \Q...\E quotes the path literally.
    mvn -q -o -f "$root/backend/pom.xml" spotless:apply "-DspotlessFiles=\\Q$file\\E" >&2 \
      || mvn -q -f "$root/backend/pom.xml" spotless:apply "-DspotlessFiles=\\Q$file\\E" >&2
    ;;
  "$root"/frontend/*.ts | "$root"/frontend/*.tsx | "$root"/frontend/*.js | "$root"/frontend/*.jsx | \
  "$root"/frontend/*.json | "$root"/frontend/*.css | "$root"/frontend/*.md | "$root"/frontend/*.html)
    prettier="$root/frontend/node_modules/.bin/prettier"
    if [[ ! -x "$prettier" ]]; then
      echo "format hook: Prettier not installed, run 'npm ci' in frontend/" >&2
      exit 1
    fi
    "$prettier" --write --ignore-unknown --log-level warn "$file" >&2
    ;;
esac
