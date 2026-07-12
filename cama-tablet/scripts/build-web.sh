#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/web"
npm install
npm run build
# Android assets (vite outDir) + iOS Resources
mkdir -p "$ROOT/ios/CamaTablet/Resources/www"
rm -rf "$ROOT/ios/CamaTablet/Resources/www"/*
cp -R "$ROOT/android/app/src/main/assets/www/"* "$ROOT/ios/CamaTablet/Resources/www/"
echo "Synced www -> android assets + ios/CamaTablet/Resources/www"
