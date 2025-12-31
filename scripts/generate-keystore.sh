#!/bin/bash

# DinApp Keystore Generation Script
# This creates a signing key for APK releases
# IMPORTANT: Never lose this keystore file!

KEYSTORE_FILE="dinapp.keystore"
KEYSTORE_ALIAS="dinapp"
KEYSTORE_PASSWORD="${KEYSTORE_PASSWORD:-ChangeMeWithSecurePassword}"
KEY_PASSWORD="${KEY_PASSWORD:-ChangeMeWithSecurePassword}"

echo "🔐 Generating DinApp Keystore..."

# Generate keystore (valid for 10 years / 3650 days)
keytool -genkey -v \
  -keystore "$KEYSTORE_FILE" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 3650 \
  -alias "$KEYSTORE_ALIAS" \
  -storepass "$KEYSTORE_PASSWORD" \
  -keypass "$KEY_PASSWORD" \
  -dname "CN=DinApp,O=DinApp Inc,L=Nairobi,S=Nairobi,C=KE"

if [ $? -eq 0 ]; then
  echo "✅ Keystore generated: $KEYSTORE_FILE"
  echo "📋 Store these values in a SECURE place:"
  echo "   Alias: $KEYSTORE_ALIAS"
  echo "   Store Password: $KEYSTORE_PASSWORD"
  echo "   Key Password: $KEY_PASSWORD"
  echo ""
  echo "⚠️  BACKUP THIS FILE IMMEDIATELY"
  echo "   Without it, you cannot sign app updates!"
else
  echo "❌ Keystore generation failed"
  exit 1
fi
