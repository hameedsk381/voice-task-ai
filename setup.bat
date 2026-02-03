@echo off
echo ================================================
echo   AI Voice + Task Intelligence Platform
echo   Initial Setup Script
echo ================================================
echo.

echo [Step 1/4] Setting up Python virtual environment...
cd backend
python -m venv venv
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create virtual environment
    pause
    exit /b 1
)

echo [Step 2/4] Installing Python dependencies...
call venv\Scripts\activate
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Python dependencies
    pause
    exit /b 1
)

echo [Step 3/4] Setting up environment file...
if not exist ".env" (
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Please edit backend\.env and add your OPENAI_API_KEY
    echo.
)

cd ..

echo [Step 4/4] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo ================================================
echo   ✅ Setup Complete!
echo ================================================
echo.
echo Next steps:
echo   1. Edit backend\.env and add your OPENAI_API_KEY
echo   2. Run: start.bat (to start both servers)
echo.
echo ================================================
pause
