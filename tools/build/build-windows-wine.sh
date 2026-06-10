#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/../.."
mkdir -p "dist/windows"

if [ ! -x ".venv-build/bin/python" ]; then
  python3 -m venv .venv-build
fi

.venv-build/bin/python -m pip install ziglang
ZIG=".venv-build/lib/python3.14/site-packages/ziglang/zig"
ZIG_GLOBAL_CACHE_DIR="${ZIG_GLOBAL_CACHE_DIR:-/tmp/zig-cache}" "$ZIG" cc \
  -target x86_64-windows-gnu \
  -municode \
  tools/desktop/windows-launcher.c \
  -lshell32 \
  -o "dist/windows/Mahjong Vibes.exe"

cp index.html styles.css game.js manifest.webmanifest sw.js "dist/windows/"
mkdir -p "dist/windows/assets"
cp assets/icon.svg "dist/windows/assets/"

echo "Windows app folder built at: dist/windows"
echo "Run on Windows by opening: dist/windows/Mahjong Vibes.exe"
