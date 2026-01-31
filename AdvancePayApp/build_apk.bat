@echo off
echo ======================================
echo Building AdvancePay APK
echo ======================================

echo.
echo Step 1: Cleaning project...
call gradlew.bat clean

echo.
echo Step 2: Building APK...
call gradlew.bat assembleDebug

echo.
echo Step 3: Copying APK to project root...
if exist app\build\outputs\apk\debug\app-debug.apk (
    copy /Y app\build\outputs\apk\debug\app-debug.apk AdvancePay.apk
    echo SUCCESS! APK is ready: AdvancePay.apk
) else if exist app\build\intermediates\apk\debug\app-debug.apk (
    copy /Y app\build\intermediates\apk\debug\app-debug.apk AdvancePay.apk
    echo SUCCESS! APK is ready: AdvancePay.apk
) else (
    echo ERROR: APK not found!
)

echo.
echo ======================================
echo Build complete!
echo ======================================
pause
