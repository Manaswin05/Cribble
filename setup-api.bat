@echo off
echo 🎨 Setting up AI Color Theme Recommender API...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    exit /b 1
)

echo ✅ Python found
echo.

REM Navigate to api directory
cd api

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo 🔌 Activating virtual environment...
call venv\Scripts\activate

REM Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt

echo.
echo ✅ Setup complete!
echo.
echo To start the API server:
echo   1. cd api
echo   2. venv\Scripts\activate
echo   3. python app.py
echo.
echo The API will be available at: http://localhost:5000
pause
