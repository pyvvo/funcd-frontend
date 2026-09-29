#!/bin/bash

STATIC_DIR="static"
TARGET_DIR="dist/static"

if [ -d "$STATIC_DIR" ]; then
  echo "Moving static files..."
  mkdir -p "$TARGET_DIR"
  cp -r "$STATIC_DIR/"* "$TARGET_DIR/"
  echo "Static files moved to $TARGET_DIR."
else
  echo "Static directory not found."
fi
