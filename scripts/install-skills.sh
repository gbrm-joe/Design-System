#!/bin/sh
# Installs the Claude Code skills shipped with @gbrm/design into the consuming
# app's `.claude/skills/`. Claude Code does not discover skills inside
# node_modules, so they have to be real files at the app root. Run from an app
# root via its `install:skills` script:
#   sh node_modules/@gbrm/design/scripts/install-skills.sh
#
# The installed copy is byte-identical to the packaged one and is OVERWRITTEN
# on every run — the skill is package-owned. Edit it upstream in the Design
# System repo, tag a release, and re-run this. Local edits are drift and will
# be lost. Re-run after every version bump; /design-update does this for you.

pkg_dir=$(cd "$(dirname "$0")/.." && pwd)
src="$pkg_dir/skills"
dest=".claude/skills"

if [ ! -d "$src" ]; then
  echo "✗ no skills/ in $pkg_dir — this version of @gbrm/design ships none"
  exit 1
fi

if [ "$(pwd -P)" = "$pkg_dir" ]; then
  echo "✗ this installs skills INTO a consuming app; run it from the app root,"
  echo "  not from the Design System repo (the skills already live here)"
  exit 1
fi

version=$(grep -m1 '"version"' "$pkg_dir/package.json" | tr -d ' ",' | cut -d: -f2)
changed=0

mkdir -p "$dest"

for dir in "$src"/*/; do
  [ -d "$dir" ] || continue
  name=$(basename "$dir")
  if [ -d "$dest/$name" ] && diff -r -q "$dir" "$dest/$name" >/dev/null 2>&1; then
    echo "· $name already current"
  else
    if [ -d "$dest/$name" ]; then verb="updated"; else verb="installed"; fi
    rm -rf "$dest/$name"
    cp -R "$dir" "$dest/$name"
    echo "✓ $name $verb (@gbrm/design v$version)"
    changed=1
  fi
done

if [ "$changed" = "1" ]; then
  echo ""
  echo "Skills changed. If a skill is running right now, re-read it from"
  echo "$dest before continuing — the loaded copy is the old one."
fi
