@echo off
echo ================================================
echo   AI Voice + Task Intelligence Platform
echo   Starting Development Servers...
echo ================================================
echo.

REM Check if virtual environment exists
if not exist "backend\venv\" (
    echo [ERROR] Python virtual environment not found!
    echo Please run: cd backend ^&^& python -m venv venv
    pause
    exit /b 1
)

REM Check if frontend node_modules exists
if not exist "frontend\node_modules\" (
    echo [ERROR] Node modules not found!
    echo Please run: cd frontend ^&^& npm install
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist "backend\.env" (
    echo [ERROR] Backend .env file not found!
    echo Please copy backend\.env.example to backend\.env
    echo and add your OPENAI_API_KEY
    pause
    exit /b 1
)

echo [1/2] Starting Backend Server (Port 8000)...
start "VoiceTask Backend" cmd /k "cd backend && venv\Scripts\activate && python main.py"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend Server (Port 3000)...
start "VoiceTask Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ================================================
echo   ✅ Both servers are starting!
echo ================================================
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo   Test:     http://localhost:3000/test
echo   Dashboard: http://localhost:3000/dashboard
echo ================================================
echo.
echo Press any key to exit this window...
echo (Servers will continue running in separate windows)
pause > nul
