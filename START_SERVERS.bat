@echo off
echo ========================================
echo Starting Cribble Full Stack
echo ========================================
echo.

echo Starting MongoDB...
start "MongoDB" mongod
timeout /t 3 /nobreak > nul
echo.

echo Starting Express Backend (Port 4000)...
start "Cribble Backend" cmd /k "cd backend && npm run dev"
timeout /t 2 /nobreak > nul
echo.

echo Starting FastAPI AI Service (Port 8000)...
start "Cribble AI Service" cmd /k "cd ai-service && uvicorn main:app --reload --port 8000"
timeout /t 2 /nobreak > nul
echo.

echo Starting React Frontend (Port 3000)...
start "Cribble Frontend" cmd /k "npm run dev"
echo.

echo ========================================
echo All services started!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:4000
echo AI Service: http://localhost:8000
echo.
echo Press any key to stop all services...
pause > nul

taskkill /FI "WindowTitle eq MongoDB*" /T /F
taskkill /FI "WindowTitle eq Cribble Backend*" /T /F
taskkill /FI "WindowTitle eq Cribble AI Service*" /T /F
taskkill /FI "WindowTitle eq Cribble Frontend*" /T /F
