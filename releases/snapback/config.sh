#!/bin/bash
#
# config.sh - Project-specific configuration for the release pipeline
# Copy this file from scripts/config.example.sh and fill in your values.
#
# This file contains all configurable settings for the build and release pipeline.
# Update these values to match your project setup.
#
# SECURITY NOTE:
# - Public URLs (https://snapbackapp.com) are safe to commit
# - API keys, private keys, and credentials should use environment variables
# - See .env.local (in .gitignore) for sensitive overrides
#

# ============================================================================
# PROJECT SETTINGS
# ============================================================================

# App name: used for DMG naming, release notes filenames, etc.
APP_NAME="Snapback"

# Project paths
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
XCODE_PROJECT_PATH="/Users/ricka7x/Projects/Snapback"
XCODE_SCHEME="Snapback"
XCODE_CONFIG="Release"

# Info.plist location (relative to XCODE_PROJECT_PATH)
INFO_PLIST="Snapback/Info.plist"

# Build output paths
BUILD_DIR="/tmp/snapback-build"
ARCHIVE_PATH="$BUILD_DIR/Snapback.xcarchive"
EXPORT_PATH="$BUILD_DIR/Export"

# Release configuration
RELEASES_DIR="$PROJECT_ROOT/releases"
WEBSITE_URL="https://snapbackapp.com"
DOWNLOAD_URL_PREFIX="$WEBSITE_URL/releases"

# Runs before anything else touches a file; a failing suite aborts the
# release with the repo completely untouched.
TEST_COMMAND="${TEST_COMMAND:-xcodebuild test -scheme Snapback -destination 'platform=macOS'}"

# snapbackapp.com is a dedicated marketing site with its own independent
# GitHub Pages deploy workflow, reading from its own local releases/ folder
# (see snapback-web/.github/workflows/deploy-gh-pages.yml). This only ever
# feeds that existing, untouched workflow data, never its code.
EXTERNAL_SITE_REPO="${EXTERNAL_SITE_REPO:-/Users/ricka7x/Projects/snapback-web}"

# Keeps 66-studio's catalog entry for Snapback pointing at the latest DMG.
CATALOG_FILE="${CATALOG_FILE:-/Users/ricka7x/Projects/66-studio/src/lib/apps.ts}"
CATALOG_APP_SLUG="${CATALOG_APP_SLUG:-snapback}"

# ============================================================================
# SPARKLE SETTINGS
# ============================================================================

# Sparkle binary is auto-detected by scripts/generate-appcast.sh.
# It checks SPARKLE_BIN/SPARKLE_TOOLS_PATH, PATH/Homebrew locations,
# then falls back to the newest DerivedData Sparkle artifact path.
#
# For custom Sparkle locations, use environment variable:
#   export SPARKLE_TOOLS_PATH="/path/to/sparkle/bin"
#   ./scripts/build-and-release.sh

# Sparkle configuration file (optional EdDSA key)
SPARKLE_ED_KEY_FILE="${SPARKLE_ED_KEY_FILE:-}"

# Snapback's public EdDSA key (from Sparkle's generate_keys tool), injected
# into Info.plist's SUPublicEDKey during notarization. Previously hardcoded
# into the shared build-and-release.sh script; moved here so each app owns
# its own key explicitly.
SPARKLE_ED_PUBLIC_KEY="${SPARKLE_ED_PUBLIC_KEY:-1btXa+HGNXBso5RoX1qjX2lltfdpXbryUma3dw6+/O4=}"

# Keychain account name for Snapback's Sparkle private key. This is Sparkle's
# own default account name, kept explicit so it's not an implicit fallback.
SPARKLE_ACCOUNT="${SPARKLE_ACCOUNT:-ed25519}"

# ============================================================================
# BUILD SETTINGS
# ============================================================================

# Code signing identity (leave empty for automatic)
CODE_SIGN_IDENTITY="Developer ID Application: Ricardo Ramirez (6WA4QS23C4)"

# Export options plist (created dynamically if not present)
EXPORT_OPTIONS_PLIST="$BUILD_DIR/ExportOptions.plist"


#=============================================================================
# NOTARIZATION SETTINGS
#=============================================================================
NOTARY_PROFILE="${NOTARY_PROFILE:-}"

# ============================================================================
# LOGGING AND DEBUGGING
# ============================================================================

# Enable verbose output
VERBOSE="${VERBOSE:-false}"

# Log file
LOG_FILE="$PROJECT_ROOT/build.log"

# ============================================================================
# VALIDATION SETTINGS
# ============================================================================

# Minimum macOS deployment target
MIN_MACOS_VERSION="12.4"

# Required files that must exist after build
REQUIRED_FILES=(
  "$EXPORT_PATH/Snapback.app"
)

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

# Print colored output
log_info() {
  echo "ℹ️  $1"
  echo "[INFO] $1" >> "$LOG_FILE"
}

log_success() {
  echo "✅ $1"
  echo "[SUCCESS] $1" >> "$LOG_FILE"
}

log_warn() {
  echo "⚠️  $1"
  echo "[WARN] $1" >> "$LOG_FILE"
}

log_error() {
  echo "❌ $1"
  echo "[ERROR] $1" >> "$LOG_FILE"
}

log_debug() {
  if [ "$VERBOSE" = "true" ]; then
    echo "🔍 $1"
  fi
  echo "[DEBUG] $1" >> "$LOG_FILE"
}

# Check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if file exists
file_exists() {
  [ -f "$1" ]
}

# Check if directory exists
dir_exists() {
  [ -d "$1" ]
}

# Validate configuration
validate_config() {
  local errors=0
  
  if ! dir_exists "$XCODE_PROJECT_PATH"; then
    log_error "Xcode project path not found: $XCODE_PROJECT_PATH"
    errors=$((errors + 1))
  fi
  
  if ! file_exists "$XCODE_PROJECT_PATH/$INFO_PLIST"; then
    log_error "Info.plist not found: $XCODE_PROJECT_PATH/$INFO_PLIST"
    errors=$((errors + 1))
  fi
  
  if ! command_exists "xcodebuild"; then
    log_error "xcodebuild not found. Please install Xcode."
    errors=$((errors + 1))
  fi
  
  if [ $errors -gt 0 ]; then
    return 1
  fi
  
  return 0
}

# Export path for use in other scripts
export PROJECT_ROOT
export XCODE_PROJECT_PATH
export RELEASES_DIR
export BUILD_DIR
export LOG_FILE

# ============================================================================
# LOCAL OVERRIDES (.env.local, gitignored, machine-specific)
# ============================================================================
# Source .env.local if it exists. This file is never committed.
# Copy .env.local.example to .env.local and fill in your values.
ENV_LOCAL="$PROJECT_ROOT/.env.local"
if [ -f "$ENV_LOCAL" ]; then
  # shellcheck source=/dev/null
  source "$ENV_LOCAL"
fi