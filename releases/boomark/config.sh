#!/bin/bash
#
# config.sh - Project-specific configuration for the release pipeline
# Copy this file from scripts/config.example.sh and fill in your values.
#
# This file contains all configurable settings for the build and release pipeline.
# Update these values to match your project setup.
#
# SECURITY NOTE:
# - Public URLs (https://66labs.dev) are safe to commit
# - API keys, private keys, and credentials should use environment variables
# - See .env.local (in .gitignore) for sensitive overrides
#

# ============================================================================
# PROJECT SETTINGS
# ============================================================================

# App name, used for DMG naming, release notes filenames, etc.
APP_NAME="Boomark"

# Project paths
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
XCODE_PROJECT_PATH="/Users/ricka7x/Projects/Boomark"
XCODE_SCHEME="Boomark"
XCODE_CONFIG="Release"

# Info.plist location (relative to XCODE_PROJECT_PATH)
INFO_PLIST="Boomark/Info.plist"

# Build output paths
BUILD_DIR="/tmp/boomark-build"
ARCHIVE_PATH="$BUILD_DIR/Boomark.xcarchive"
EXPORT_PATH="$BUILD_DIR/Export"

# Release configuration
RELEASES_DIR="$PROJECT_ROOT/releases"
# Boomark's home is the 66 labs catalog (not a dedicated domain, it's a new,
# pre-launch app). See macos-app-release-pipeline skill for the catalog-vs-
# dedicated-domain decision.
WEBSITE_URL="https://66labs.dev/apps/boomark"

# Runs before anything else touches a file; a failing suite aborts the
# release with the repo completely untouched. BoomarkKit's tests, not the
# Xcode app target's own (it has none), hence `swift test` in the SPM package.
TEST_COMMAND="${TEST_COMMAND:-cd BoomarkKit && swift test}"

# Shared Cloudflare R2 release hosting (see macos-release-tools config.example.sh
# for details). DOWNLOAD_URL_PREFIX points at the R2 bucket's custom domain so
# Sparkle appcast URLs resolve there instead of this repo's own releases/ dir.
R2_BUCKET="app-releases"
R2_PREFIX="$APP_NAME"
DOWNLOAD_URL_PREFIX="https://dl.66labs.dev/$APP_NAME"

# Auto-purges Cloudflare's cache for files just synced to R2 (see
# config.example.sh for why). This is the 66labs.dev zone, matching
# DOWNLOAD_URL_PREFIX above. Also requires CLOUDFLARE_API_TOKEN exported in
# the shell running the release, never stored here.
CF_ZONE_ID="e85170acb9523dca14edfd3cb4105833"

# ============================================================================
# SPARKLE SETTINGS
# ============================================================================
#
# NOTE: Boomark does not have the Sparkle framework wired into its Xcode
# project yet. This pipeline assumes it does (it injects SUFeedURL/
# SUPublicEDKey into Info.plist and re-signs Sparkle.framework during
# notarization). Add Sparkle to the app target, generate an EdDSA keypair,
# and fill in SPARKLE_ED_PUBLIC_KEY below before running a real release.

# Sparkle tools are auto-detected by scripts/generate-appcast.sh.
# It checks SPARKLE_BIN/SPARKLE_TOOLS_PATH, PATH/Homebrew locations,
# then falls back to the newest DerivedData Sparkle artifact path.
#
# For custom Sparkle locations, use environment variable:
#   export SPARKLE_TOOLS_PATH="/path/to/sparkle/bin"
#   ./scripts/build-and-release.sh

# The app's public EdDSA key (from Sparkle's generate_keys tool), injected
# into Info.plist's SUPublicEDKey during notarization.
SPARKLE_ED_PUBLIC_KEY="${SPARKLE_ED_PUBLIC_KEY:-PzmWQhXGG0+73EZgZmhNwwN5gZ2VzT7ukN8L0HWs9f8=}"

# Boomark's Sparkle private key lives under its own keychain account (not the
# shared "ed25519" default), so it never collides with Snapback's key on the
# same Mac.
SPARKLE_ACCOUNT="${SPARKLE_ACCOUNT:-boomark}"

# Optional EdDSA private key file for signing releases
SPARKLE_ED_KEY_FILE="${SPARKLE_ED_KEY_FILE:-}"

# ============================================================================
# BUILD SETTINGS
# ============================================================================

# Code signing identity (leave empty for automatic)
CODE_SIGN_IDENTITY="Developer ID Application: Ricardo Ramirez (6WA4QS23C4)"

# Explicit Developer ID provisioning profile, required because Boomark's iCloud/
# CloudKit entitlement can't be covered by Xcode's automatic signing for Developer ID
# distribution (automatic signing only covers Development/Mac App Store profiles).
# Created once in developer.apple.com > Certificates, IDs & Profiles > Profiles >
# Developer ID, bound to the com.66labs.Boomark App ID. Installed at
# ~/Library/MobileDevice/Provisioning Profiles/<uuid>.provisionprofile.
BUNDLE_IDENTIFIER="com.66labs.Boomark"
PROVISIONING_PROFILE_UUID="9956fc57-db63-4aa5-9c87-69dcde9fe09b"

# Export options plist (created dynamically if not present)
EXPORT_OPTIONS_PLIST="$BUILD_DIR/ExportOptions.plist"

# ============================================================================
# NOTARIZATION SETTINGS
# ============================================================================

# Same Apple Developer team/account as Snapback (same Developer ID cert), so
# the keychain profile is shared rather than creating a separate one.
NOTARY_PROFILE="${NOTARY_PROFILE:-snapback-notary}"

# ============================================================================
# LOGGING AND DEBUGGING
# ============================================================================

VERBOSE="${VERBOSE:-false}"
LOG_FILE="$PROJECT_ROOT/build.log"

# ============================================================================
# VALIDATION SETTINGS
# ============================================================================

MIN_MACOS_VERSION="14.6"

REQUIRED_FILES=(
  "$EXPORT_PATH/Boomark.app"
)

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

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

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

file_exists() {
  [ -f "$1" ]
}

dir_exists() {
  [ -d "$1" ]
}

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

export PROJECT_ROOT
export XCODE_PROJECT_PATH
export RELEASES_DIR
export BUILD_DIR
export LOG_FILE

# ============================================================================
# LOCAL OVERRIDES (.env.local, gitignored, machine-specific)
# ============================================================================
ENV_LOCAL="$PROJECT_ROOT/.env.local"
if [ -f "$ENV_LOCAL" ]; then
  # shellcheck source=/dev/null
  source "$ENV_LOCAL"
fi
