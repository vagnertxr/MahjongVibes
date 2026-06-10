#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/../.."
PYTHON="${PYTHON:-python3}"

if [ ! -x ".venv-build/bin/python" ]; then
  "$PYTHON" -m venv .venv-build
fi

.venv-build/bin/python -m pip install pyinstaller
.venv-build/bin/pyinstaller --clean --noconfirm tools/build/mahjong-vibes.spec

mkdir -p "dist/linux"
cp "dist/Mahjong Vibes" "dist/linux/Mahjong Vibes"
cat > "dist/linux/Mahjong Vibes.desktop" <<'DESKTOP'
[Desktop Entry]
Type=Application
Name=Mahjong Vibes
Comment=Riichi Mahjong browser game
Exec=Mahjong Vibes
Terminal=true
Categories=Game;
DESKTOP
chmod +x "dist/linux/Mahjong Vibes"

echo "Linux app built at: dist/linux/Mahjong Vibes"
