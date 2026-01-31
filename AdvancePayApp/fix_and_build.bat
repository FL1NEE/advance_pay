@echo off
echo ==========================================
echo Fixing Kotlin Daemon Issues and Building
echo ==========================================

echo.
echo Step 1: Stopping all Gradle daemons...
call gradlew --stop
timeout /t 2 /nobreak >nul

echo.
echo Step 2: Killing any remaining Java processes...
taskkill /F /IM java.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Step 3: Deleting build directories...
if exist app\build rmdir /S /Q app\build
if exist build rmdir /S /Q build
if exist .gradle rmdir /S /Q .gradle

echo.
echo Step 4: Building APK (this may take a few minutes)...
call gradlew assembleDebug --no-daemon

echo.
echo Step 5: Copying APK to project root...
if exist app\build\outputs\apk\debug\app-debug.apk (
    copy /Y app\build\outputs\apk\debug\app-debug.apk AdvancePay.apk
    echo.
    echo ==========================================
    echo SUCCESS! APK is ready: AdvancePay.apk
    echo ==========================================
) else if exist app\build\intermediates\apk\debug\app-debug.apk (
    copy /Y app\build\intermediates\apk\debug\app-debug.apk AdvancePay.apk
    echo.
    echo ==========================================
    echo SUCCESS! APK is ready: AdvancePay.apk
    echo ==========================================
) else (
    echo.
    echo ==========================================
    echo ERROR: APK not found! Check the errors above.
    echo ==========================================
)

echo.
pause
