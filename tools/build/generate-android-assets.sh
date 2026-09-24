#!/bin/sh
# Renders the Android launcher icons and splash screens from the SVG sources in
# assets/. Run it after `npx cap add android`, which lays down Capacitor's own
# placeholder artwork, and any time the icon art changes.
#
# Needs rsvg-convert (librsvg) and ImageMagick, plus a CJK font for the tile's
# dragon mark.
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
RES="$ROOT/android/app/src/main/res"

ICON="$ROOT/assets/icon.svg"
ICON_ROUND="$ROOT/assets/android/icon-round.svg"
ICON_FOREGROUND="$ROOT/assets/android/icon-foreground.svg"

# The felt the game opens on, matching background_color in the web manifest.
SPLASH_BG="#08382f"

command -v rsvg-convert >/dev/null || { echo "rsvg-convert not found (install librsvg)" >&2; exit 1; }
command -v magick >/dev/null || { echo "magick not found (install ImageMagick)" >&2; exit 1; }
[ -d "$RES" ] || { echo "No Android project yet. Run: npx cap add android" >&2; exit 1; }

render() {
  rsvg-convert -w "$2" -h "$2" "$1" -o "$3"
}

# Launcher icons. The legacy square and round icons are what pre-Android-8
# launchers and round-icon launchers show; the foreground layer is the one the
# adaptive icon masks, over the flat colour in values/ic_launcher_background.xml.
set -- "mdpi 48 108" "hdpi 72 162" "xhdpi 96 216" "xxhdpi 144 324" "xxxhdpi 192 432"
for entry in "$@"; do
  # shellcheck disable=SC2086
  set -- $entry
  density=$1
  legacy=$2
  adaptive=$3
  render "$ICON" "$legacy" "$RES/mipmap-$density/ic_launcher.png"
  render "$ICON_ROUND" "$legacy" "$RES/mipmap-$density/ic_launcher_round.png"
  render "$ICON_FOREGROUND" "$adaptive" "$RES/mipmap-$density/ic_launcher_foreground.png"
  echo "icons  $density"
done

# Splash screens. The tile is drawn once and centred on each canvas rather than
# stretched, so it keeps its proportions from a small portrait phone up to a
# large landscape tablet.
TILE="${TMPDIR:-/tmp}/mahjong-splash-tile.png"
trap 'rm -f "$TILE"' EXIT
rsvg-convert -w 512 -h 512 "$ICON_FOREGROUND" -o "$TILE"

splash() {
  target=$1
  width=$2
  height=$3
  short=$width
  [ "$height" -lt "$short" ] && short=$height
  # A third of the shorter edge keeps the tile clear of any system chrome.
  tile_size=$((short / 3))
  magick -size "${width}x${height}" "xc:$SPLASH_BG" \
    \( "$TILE" -resize "${tile_size}x${tile_size}" \) \
    -gravity center -composite "$target"
}

splash "$RES/drawable/splash.png" 480 320
for entry in "mdpi 480 320" "hdpi 800 480" "xhdpi 1280 720" "xxhdpi 1600 960" "xxxhdpi 1920 1280"; do
  # shellcheck disable=SC2086
  set -- $entry
  splash "$RES/drawable-land-$1/splash.png" "$2" "$3"
  splash "$RES/drawable-port-$1/splash.png" "$3" "$2"
  echo "splash $1"
done

echo "Android artwork regenerated from $ICON"
