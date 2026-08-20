@echo off
setlocal enabledelayedexpansion

set PORT=8000
set URL=http://localhost:%PORT%/tms.html

echo.
echo ============================================
echo  SIT Timetable Management System
echo ============================================
echo.
echo Starting server on %URL%
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"

REM Start Python HTTP server
start python -m http.server %PORT%

REM Wait for server to start
timeout /t 2 /nobreak

REM Open in browser
start %URL%

echo.
echo Server is running. Open your browser if it didn't open automatically.
echo.
timeout /t 300
