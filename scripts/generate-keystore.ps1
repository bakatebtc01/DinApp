# DinApp Keystore Generation Script (Windows PowerShell)
# This creates a signing key for APK releases
# IMPORTANT: Never lose this keystore file!

param(
    [string]$KeystorePath = "dinapp.keystore",
    [string]$KeystoreAlias = "dinapp",
    [string]$KeystorePassword = "ChangeMeWithSecurePassword",
    [string]$KeyPassword = "ChangeMeWithSecurePassword"
)

Write-Host "🔐 Generating DinApp Keystore..." -ForegroundColor Cyan

# Generate keystore (valid for 10 years / 3650 days)
$keytoolArgs = @(
    "-genkey",
    "-v",
    "-keystore", $KeystorePath,
    "-keyalg", "RSA",
    "-keysize", "2048",
    "-validity", "3650",
    "-alias", $KeystoreAlias,
    "-storepass", $KeystorePassword,
    "-keypass", $KeyPassword,
    "-dname", "CN=DinApp,O=DinApp Inc,L=Nairobi,S=Nairobi,C=KE"
)

try {
    keytool @keytoolArgs
    Write-Host "✅ Keystore generated: $KeystorePath" -ForegroundColor Green
    Write-Host "📋 Store these values in a SECURE place:" -ForegroundColor Yellow
    Write-Host "   Alias: $KeystoreAlias"
    Write-Host "   Store Password: $KeystorePassword"
    Write-Host "   Key Password: $KeyPassword"
    Write-Host ""
    Write-Host "⚠️  BACKUP THIS FILE IMMEDIATELY" -ForegroundColor Red
    Write-Host "   Without it, you cannot sign app updates!"
}
catch {
    Write-Host "❌ Keystore generation failed: $_" -ForegroundColor Red
    exit 1
}
