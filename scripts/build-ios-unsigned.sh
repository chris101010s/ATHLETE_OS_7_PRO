#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
WS="$(find ios -maxdepth 1 -name '*.xcworkspace' -print -quit)"
if [[ -z "$WS" ]]; then echo 'ERROR: ios Workspace fehlt.' >&2; exit 1; fi
SCHEME="$(basename "$WS" .xcworkspace)"
mkdir -p artifacts
# Ein echter iphoneos-Device-Build, NICHT iOS-Simulator; React Native bündelt JS im Release-Build.
xcodebuild -workspace "$WS" -scheme "$SCHEME" \
  -configuration Release -sdk iphoneos -destination 'generic/platform=iOS' \
  -derivedDataPath "$ROOT/artifacts/DerivedData" \
  CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO CODE_SIGN_IDENTITY='' \
  build 2>&1 | tee "$ROOT/artifacts/xcodebuild.log"
APP="$(find "$ROOT/artifacts/DerivedData/Build/Products/Release-iphoneos" -maxdepth 1 -name '*.app' -print -quit)"
if [[ -z "$APP" ]]; then echo 'ERROR: iPhone .app nicht gefunden.' >&2; exit 1; fi
[[ -f "$APP/Info.plist" ]] || { echo 'ERROR: Info.plist fehlt.' >&2; exit 1; }
[[ -f "$APP/main.jsbundle" ]] || { echo 'ERROR: Release JavaScript bundle fehlt.' >&2; exit 1; }
rm -rf "$ROOT/artifacts/Payload"
mkdir -p "$ROOT/artifacts/Payload"
cp -R "$APP" "$ROOT/artifacts/Payload/"
rm -f "$ROOT/artifacts/ATHLETE_OS_unsigned.ipa"
(cd "$ROOT/artifacts" && /usr/bin/zip -q -r ATHLETE_OS_unsigned.ipa Payload)
[[ -s "$ROOT/artifacts/ATHLETE_OS_unsigned.ipa" ]] || { echo 'ERROR: IPA leer.' >&2; exit 1; }
echo 'FERTIG: artifacts/ATHLETE_OS_unsigned.ipa (nicht signiert)'
