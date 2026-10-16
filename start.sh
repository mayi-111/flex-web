#!/usr/bin/env bash
# =========================================================================
# RHINE LAB TERMINAL OS // GARGANTUA BLACK HOLE ENGINE
# Cross-Platform Startup Script for macOS / Linux
# =========================================================================

set -e

echo "=== RHINE LAB TERMINAL OS // BOOTLOADER ==="
echo ""

# Check Node.js
if ! command -v node >/dev/null 2>&1; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please install Node.js (LTS version recommended): https://nodejs.org/"
    exit 1
fi

echo "[1/3] Node $(node -v) & NPM $(npm -v) detected."

# Check node_modules
if [ ! -d "node_modules" ]; then
    echo "[2/3] Installing dependencies..."
    npm install
else
    echo "[2/3] Dependencies ready."
fi

# Run dev server with browser open
echo "[3/3] Starting development server..."
npm run dev -- --open
