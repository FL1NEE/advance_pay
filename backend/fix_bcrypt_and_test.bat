@echo off
echo ========================================
echo Fixing bcrypt compatibility issue
echo ========================================
echo.

echo Step 1: Uninstalling old bcrypt and passlib...
pip uninstall -y bcrypt passlib

echo.
echo Step 2: Installing updated versions...
pip install bcrypt>=4.0.1
pip install passlib>=1.7.4

echo.
echo Step 3: Testing user creation...
python create_test_user.py

echo.
echo ========================================
echo Done!
echo ========================================
pause
