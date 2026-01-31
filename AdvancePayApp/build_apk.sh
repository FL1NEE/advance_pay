#!/bin/bash

echo "======================================"
echo "Building AdvancePay APK"
echo "======================================"

echo ""
echo "Step 1: Cleaning project..."
./gradlew clean

echo ""
echo "Step 2: Building APK..."
./gradlew assembleDebug

echo ""
echo "Step 3: Copying APK to project root..."
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    cp app/build/outputs/apk/debug/app-debug.apk AdvancePay.apk
    echo "SUCCESS! APK is ready: AdvancePay.apk"
elif [ -f "app/build/intermediates/apk/debug/app-debug.apk" ]; then
    cp app/build/intermediates/apk/debug/app-debug.apk AdvancePay.apk
    echo "SUCCESS! APK is ready: AdvancePay.apk"
else
    echo "ERROR: APK not found!"
fi

echo ""
echo "======================================"
echo "Build complete!"
echo "======================================"
