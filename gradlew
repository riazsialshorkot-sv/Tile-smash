#!/bin/sh
# Root wrapper to delegate to android/gradlew
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -d "$SCRIPT_DIR/android" ]; then
    cd "$SCRIPT_DIR/android" || exit 1
    exec ./gradlew "$@"
else
    echo "ERROR: android directory not found at $SCRIPT_DIR/android"
    exit 1
fi
