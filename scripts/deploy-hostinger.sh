#!/usr/bin/env bash
#
# Publish the static build to the `hostinger-deploy` branch.
#
#   npm run deploy:hostinger
#
# Builds the site, then mirrors the contents of `out/` onto the root of the
# `hostinger-deploy` branch and pushes it. Hostinger's Git deployment pulls
# that branch into public_html.
#
# A dedicated git worktree is used instead of switching branches in the main
# checkout, so node_modules and source files can never be committed to the
# deploy branch, and your working tree is never disturbed.

set -euo pipefail

BRANCH="hostinger-deploy"
WORKTREE=".deploy-worktree"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "==> Building static export"
npm run build

if [ ! -f out/index.html ]; then
  echo "ERROR: out/index.html not found. Is output:'export' set in next.config.ts?" >&2
  exit 1
fi

echo "==> Preparing $BRANCH worktree"
git worktree remove --force "$WORKTREE" 2>/dev/null || true
rm -rf "$WORKTREE"

if git show-ref --quiet "refs/heads/$BRANCH"; then
  git worktree add "$WORKTREE" "$BRANCH" >/dev/null
elif git ls-remote --exit-code --heads origin "$BRANCH" >/dev/null 2>&1; then
  git worktree add "$WORKTREE" -b "$BRANCH" --track "origin/$BRANCH" >/dev/null
else
  git worktree add --detach "$WORKTREE" >/dev/null
  git -C "$WORKTREE" checkout --orphan "$BRANCH" >/dev/null 2>&1
  git -C "$WORKTREE" rm -rqf . 2>/dev/null || true
fi

echo "==> Mirroring out/ to branch root"
# Remove previous build output (everything except git metadata), then copy fresh.
find "$WORKTREE" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -R out/. "$WORKTREE"/

echo "==> Committing"
cd "$WORKTREE"
git add -A
if git diff --cached --quiet; then
  echo "    No changes since last deploy — nothing to push."
else
  git commit -q -m "Deploy static build $(git -C "$REPO_ROOT" rev-parse --short HEAD)"
  # By default push to every configured remote so GitLab and GitHub never
  # drift. Set REMOTES to limit it, e.g. REMOTES=github npm run deploy:hostinger
  for remote in ${REMOTES:-$(git -C "$REPO_ROOT" remote)}; do
    if git push -q "$remote" "$BRANCH" 2>/dev/null; then
      echo "    Pushed to $remote/$BRANCH"
    else
      echo "    WARNING: could not push to $remote (check credentials)" >&2
    fi
  done
fi

cd "$REPO_ROOT"
git worktree remove --force "$WORKTREE"

echo
echo "Done. Now open Hostinger -> Advanced -> Git and click Deploy"
echo "(or wait for auto-deploy if a webhook is configured)."
