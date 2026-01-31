@echo off
echo =============================================
echo Building COMPATIBLE APK for Android 16
echo =============================================

echo.
echo Step 1: Stopping Gradle daemon...
call gradlew --stop
timeout /t 2 /nobreak >nul

echo.
echo Step 2: Killing Java processes...
taskkill /F /IM java.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Step 3: Cleaning build directories...
if exist app\build rmdir /S /Q app\build
if exist build rmdir /S /Q build
if exist .gradle rmdir /S /Q .gradle

echo.
echo Step 4: Building DEBUG APK (more compatible)...
call gradlew assembleDebug --no-daemon --info

echo.
echo Step 5: Locating and copying APK...
if exist app\build\outputs\apk\debug\app-debug.apk (
    copy /Y app\build\outputs\apk\debug\app-debug.apk AdvancePay-compatible.apk
    echo.
    echo =============================================
    echo SUCCESS! APK: AdvancePay-compatible.apk
    echo =============================================
    echo.
    echo APK Info:
    echo - Package: com.advancepay.debug
    echo - MinSDK: 24 (Android 7.0)
    echo - TargetSDK: 33 (compatible with Android 16)
    echo - Architectures: arm64-v8a, armeabi-v7a, x86, x86_64
    echo.
    goto install_choice
) else if exist app\build\intermediates\apk\debug\app-debug.apk (
    copy /Y app\build\intermediates\apk\debug\app-debug.apk AdvancePay-compatible.apk
    echo.
    echo =============================================
    echo SUCCESS! APK: AdvancePay-compatible.apk
    echo =============================================
    goto install_choice
) else (
    echo.
    echo =============================================
    echo ERROR: APK not found!
    echo =============================================
    echo Check the build errors above.
    goto end
)

:install_choice
echo.
echo Would you like to install it now? (Y/N)
set /p choice="Your choice: "
if /i "%choice%"=="Y" goto install
if /i "%choice%"=="y" goto install
goto end

:install
echo.
echo Checking for connected devices...
adb devices
echo.
echo Installing APK...
adb uninstall com.advancepay 2>nul
adb uninstall com.advancepay.debug 2>nul
adb install -r AdvancePay-compatible.apk

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =============================================
    echo Installation SUCCESS!
    echo =============================================
    echo.
    echo You can now:
    echo 1. Open AdvancePay app on your device
    echo 2. Login with your credentials
    echo 3. Grant notification access
    echo.
) else (
    echo.
    echo =============================================
    echo Installation FAILED!
    echo =============================================
    echo.
    echo Try manual installation:
    echo 1. Copy AdvancePay-compatible.apk to your device
    echo 2. Open the file on device
    echo 3. Allow installation from unknown sources
    echo 4. Install
    echo.
)

:end
echo.
pause
