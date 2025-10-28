@echo off
REM StudyBuddi Setup Script for Windows
REM This script helps set up the development environment for new contributors

echo ======================================
echo   StudyBuddi Development Setup
echo ======================================
echo.

REM Check if Node.js is installed
echo Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% found

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION% found

REM Check if MySQL is installed
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] MySQL is not installed or not in PATH
    echo Please install MySQL from https://dev.mysql.com/downloads/installer/
) else (
    echo [OK] MySQL found
)

echo.
echo ======================================
echo Installing dependencies...
echo ======================================
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed successfully

echo.
echo ======================================
echo Setting up environment variables...
echo ======================================

REM Create .env file if it doesn't exist
if not exist .env (
    copy .env.example .env
    echo [OK] Created .env file from .env.example
    echo [WARNING] Please update .env with your MySQL credentials
) else (
    echo [WARNING] .env file already exists, skipping...
)

echo.
echo ======================================
echo Database Setup
echo ======================================
echo To set up the database, run the following command:
echo mysql -u root -p ^< server/models/schema.sql
echo.
echo Or manually in MySQL:
echo   1. mysql -u root -p
echo   2. source server/models/schema.sql
echo.

echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo Next steps:
echo   1. Update .env with your MySQL credentials
echo   2. Create the database: mysql -u root -p ^< server/models/schema.sql
echo   3. Start development: npm run dev
echo.
echo Available commands:
echo   npm run dev     - Start both frontend and backend
echo   npm run client  - Start only frontend (port 3000)
echo   npm run server  - Start only backend (port 5000)
echo   npm run build   - Build for production
echo.
echo Happy coding!
echo.
pause
