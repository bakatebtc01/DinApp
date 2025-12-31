# DinApp Android APK

## Local Build & Testing

```bash
# Navigate to mobile folder
cd mobile

# Build release APK
./gradlew assembleRelease

# Build debug APK (for testing)
./gradlew assembleDebug

# Run tests
./gradlew test

# Install on connected device
./gradlew installDebug

# Install and run tests
./gradlew connectedAndroidTest
```

## APK Output Location

```bash
mobile/app/build/outputs/apk/release/app-release.apk
mobile/app/build/outputs/apk/debug/app-debug.apk
```

## Gradle Wrapper Setup

The Android project uses Gradle Wrapper for consistent builds:

```bash
# On first run (automatically done by IDE)
./gradlew --version

# If wrapper not found, initialize it
gradle wrapper --gradle-version 8.1.0
```

## Environment Variables (for CI/CD)

```bash
export KEYSTORE_PASSWORD="your-secure-password"
export KEY_ALIAS="dinapp"
export KEY_PASSWORD="your-secure-password"

# Then build
./gradlew assembleRelease
```

## APK Signing

APKs are automatically signed with the keystore specified in `app/build.gradle`:

- Keystore file: `dinapp.keystore` (in project root)
- Alias: `dinapp`
- Validity: 10 years (3650 days)

## Size Optimization

- **Debug APK:** ~100-120 MB
- **Release APK:** ~40-60 MB (due to minification and resource shrinking)
- **Target:** Keep under 50 MB for easy distribution

Release builds are minified using ProGuard.

## Version Management

Version is controlled in `app/build.gradle`:

```gradle
versionCode 1      // Internal version number
versionName "0.1"  // User-visible version
```

Update before each release:

- Increment `versionCode`
- Update `versionName` to semantic version
