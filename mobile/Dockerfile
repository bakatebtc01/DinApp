# Build stage for DinApp APK
FROM ubuntu:22.04 AS builder

# Install Java and required tools
RUN apt-get update && apt-get install -y \
    openjdk-11-jdk-headless \
    wget \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set Java home
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

# Install Android SDK
RUN mkdir -p /opt/android-sdk && \
    cd /opt/android-sdk && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip && \
    unzip -q commandlinetools-linux-9477386_latest.zip && \
    rm commandlinetools-linux-9477386_latest.zip

# Set Android SDK path
ENV ANDROID_SDK_ROOT=/opt/android-sdk/cmdline-tools/latest
ENV PATH=$PATH:$ANDROID_SDK_ROOT/bin

# Accept Android licenses
RUN yes | $ANDROID_SDK_ROOT/bin/sdkmanager --licenses

# Install Android SDK components
RUN $ANDROID_SDK_ROOT/bin/sdkmanager \
    "platforms;android-34" \
    "build-tools;34.0.0" \
    "platform-tools" \
    "tools"

# Copy DinApp source
COPY . /app
WORKDIR /app/mobile

# Build APK
RUN chmod +x ./gradlew && \
    ./gradlew clean assembleRelease

# Runtime stage
FROM alpine:latest

# Install required tools for upload
RUN apk add --no-cache curl wget

# Copy APK from builder
COPY --from=builder /app/mobile/app/build/outputs/apk/release/app-release.apk /app/dinapp-v0.1.apk

# Create script for SHA256 calculation and upload
RUN echo '#!/bin/sh' > /app/upload.sh && \
    echo 'echo "APK built and ready for upload"' >> /app/upload.sh && \
    echo 'sha256sum /app/dinapp-v0.1.apk' >> /app/upload.sh && \
    chmod +x /app/upload.sh

WORKDIR /app

CMD ["sh", "-c", "sha256sum dinapp-v0.1.apk && echo 'APK ready for distribution'"]
