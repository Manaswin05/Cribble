@echo off
echo ========================================
echo Cribble Backend Setup (Windows)
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
echo.

echo [2/4] Setting up Backend Environment...
if not exist .env (
    copy .env.example .env
    echo Created .env file - Please add your configuration
) else (
    echo .env file already exists
)
echo.

echo [3/4] Installing AI Service Dependencies...
cd ..\ai-service
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install AI service dependencies
    echo Make sure Python and pip are installed
    pause
    exit /b 1
)
echo.

echo [4/4] Setting up AI Service Environment...
if not exist .env (
    copy .env.example .env
    echo Created .env file - Please add your Gemini API key
) else (
    echo .env file already exists
)
echo.

cd ..
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is running (mongod)
echo 2. Add your Gemini API key to ai-service\.env
echo 3. Run: npm run dev:all
echo.
pause
