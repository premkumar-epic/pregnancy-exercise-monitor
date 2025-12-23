@echo off
SETLOCAL EnableDelayedExpansion

:: ============================================
:: AI-Powered Pregnancy Care - Setup Script
:: ============================================
:: This script automates the complete setup process:
:: 1. Clones the repository from GitHub
:: 2. Creates Python virtual environment
:: 3. Installs backend dependencies
:: 4. Runs database migrations
:: 5. Creates admin user
:: 6. Installs frontend dependencies
:: 7. Launches both backend and frontend servers
:: ============================================

echo.
echo ========================================
echo  AI-Powered Pregnancy Care Setup
echo ========================================
echo.

:: Set variables
set REPO_URL=https://github.com/premkumar-epic/pregnancy-exercise-monitor
set PROJECT_NAME=pregnancy-exercise-monitor
set BACKEND_DIR=%CD%\%PROJECT_NAME%\backend
set FRONTEND_DIR=%CD%\%PROJECT_NAME%\frontend
set VENV_DIR=%BACKEND_DIR%\.venv

:: Color codes for output
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

:: ============================================
:: Step 1: Check Prerequisites
:: ============================================
echo %BLUE%[1/9] Checking prerequisites...%NC%
echo.

:: Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %RED%ERROR: Git is not installed!%NC%
    echo Please install Git from https://git-scm.com/download/win
    pause
    exit /b 1
)
echo %GREEN%✓ Git found%NC%

:: Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %RED%ERROR: Python is not installed!%NC%
    echo Please install Python 3.10+ from https://www.python.org/downloads/
    pause
    exit /b 1
)

:: Check Python version
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo %GREEN%✓ Python %PYTHON_VERSION% found%NC%

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %RED%ERROR: Node.js is not installed!%NC%
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

:: Check Node version
for /f "tokens=1" %%i in ('node --version') do set NODE_VERSION=%%i
echo %GREEN%✓ Node.js %NODE_VERSION% found%NC%

:: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %RED%ERROR: npm is not installed!%NC%
    pause
    exit /b 1
)
echo %GREEN%✓ npm found%NC%

echo.
echo %GREEN%All prerequisites met!%NC%
timeout /t 2 >nul

:: ============================================
:: Step 2: Clone Repository
:: ============================================
echo.
echo %BLUE%[2/9] Cloning repository...%NC%
echo.

:: Check if directory already exists
if exist "%PROJECT_NAME%" (
    echo %YELLOW%WARNING: Directory '%PROJECT_NAME%' already exists!%NC%
    set /p OVERWRITE="Do you want to delete and re-clone? (y/n): "
    if /i "!OVERWRITE!"=="y" (
        echo Removing existing directory...
        rmdir /s /q "%PROJECT_NAME%"
        if %ERRORLEVEL% NEQ 0 (
            echo %RED%ERROR: Failed to remove existing directory!%NC%
            pause
            exit /b 1
        )
    ) else (
        echo Using existing directory...
        goto :skip_clone
    )
)

:: Clone the repository
echo Cloning from %REPO_URL%...
git clone %REPO_URL%
if %ERRORLEVEL% NEQ 0 (
    echo %RED%ERROR: Failed to clone repository!%NC%
    echo Please check your internet connection and repository URL.
    pause
    exit /b 1
)
echo %GREEN%✓ Repository cloned successfully%NC%

:skip_clone

:: ============================================
:: Step 3: Create Virtual Environment
:: ============================================
echo.
echo %BLUE%[3/9] Creating Python virtual environment...%NC%
echo.

cd "%BACKEND_DIR%"
if %ERRORLEVEL% NEQ 0 (
    echo %RED%ERROR: Backend directory not found!%NC%
    pause
    exit /b 1
)

:: Check if venv already exists
if exist ".venv" (
    echo %YELLOW%Virtual environment already exists, skipping creation...%NC%
) else (
    python -m venv .venv
    if %ERRORLEVEL% NEQ 0 (
        echo %RED%ERROR: Failed to create virtual environment!%NC%
        pause
        exit /b 1
    )
    echo %GREEN%✓ Virtual environment created%NC%
)

:: ============================================
:: Step 4: Install Backend Dependencies
:: ============================================
echo.
echo %BLUE%[4/9] Installing backend dependencies...%NC%
echo.

:: Activate virtual environment
call .venv\Scripts\activate.bat
if %ERRORLEVEL% NEQ 0 (
    echo %RED%ERROR: Failed to activate virtual environment!%NC%
    pause
    exit /b 1
)
echo %GREEN%✓ Virtual environment activated%NC%

:: Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip --quiet
if %ERRORLEVEL% NEQ 0 (
    echo %YELLOW%WARNING: Failed to upgrade pip, continuing...%NC%
)

:: Install requirements
echo Installing Python packages...
if exist "requirements.txt" (
    pip install -r requirements.txt
    if %ERRORLEVEL% NEQ 0 (
        echo %RED%ERROR: Failed to install backend dependencies!%NC%
        pause
        exit /b 1
    )
    echo %GREEN%✓ Backend dependencies installed%NC%
) else (
    echo %RED%ERROR: requirements.txt not found!%NC%
    pause
    exit /b 1
)

:: ============================================
:: Step 5: Run Database Migrations
:: ============================================
echo.
echo %BLUE%[5/9] Running database migrations...%NC%
echo.

python manage.py makemigrations
if %ERRORLEVEL% NEQ 0 (
    echo %YELLOW%WARNING: makemigrations had issues, continuing...%NC%
)

python manage.py migrate
if %ERRORLEVEL% NEQ 0 (
    echo %RED%ERROR: Failed to run migrations!%NC%
    pause
    exit /b 1
)
echo %GREEN%✓ Database migrations completed%NC%

:: ============================================
:: Step 6: Create Admin User
:: ============================================
echo.
echo %BLUE%[6/9] Creating admin user...%NC%
echo.

:: Check if admin user already exists
python -c "from django.contrib.auth.models import User; exit(0 if User.objects.filter(username='admin').exists() else 1)" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo %YELLOW%Admin user already exists, skipping creation...%NC%
) else (
    echo Creating admin user (username: admin, password: admin123)...
    python manage.py shell < nul > nul 2>&1 << EOF
from django.contrib.auth.models import User
from exercise.models import UserProfile
try:
    admin = User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    UserProfile.objects.create(user=admin, role='admin')
    print('Admin user created successfully')
except Exception as e:
    print(f'Error: {e}')
EOF
    
    if %ERRORLEVEL% EQU 0 (
        echo %GREEN%✓ Admin user created%NC%
        echo.
        echo %YELLOW%Admin Credentials:%NC%
        echo   Username: admin
        echo   Password: admin123
    ) else (
        echo %YELLOW%WARNING: Could not create admin user automatically%NC%
        echo You can create it manually later using Django admin
    )
)

:: ============================================
:: Step 7: Install Frontend Dependencies
:: ============================================
echo.
echo %BLUE%[7/9] Installing frontend dependencies...%NC%
echo.

cd "%FRONTEND_DIR%"
if %ERRORLEVEL% NEQ 0 (
    echo %RED%ERROR: Frontend directory not found!%NC%
    pause
    exit /b 1
)

:: Check if node_modules exists
if exist "node_modules" (
    echo %YELLOW%node_modules already exists, skipping installation...%NC%
    set /p REINSTALL="Do you want to reinstall? (y/n): "
    if /i "!REINSTALL!"=="y" (
        echo Removing node_modules...
        rmdir /s /q node_modules
        del package-lock.json 2>nul
    ) else (
        goto :skip_npm_install
    )
)

echo Installing npm packages (this may take a few minutes)...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo %RED%ERROR: Failed to install frontend dependencies!%NC%
    pause
    exit /b 1
)
echo %GREEN%✓ Frontend dependencies installed%NC%

:skip_npm_install

:: ============================================
:: Step 8: Display Setup Summary
:: ============================================
echo.
echo %GREEN%========================================%NC%
echo %GREEN% Setup Completed Successfully!%NC%
echo %GREEN%========================================%NC%
echo.
echo %BLUE%Project Location:%NC% %CD%\..
echo %BLUE%Backend:%NC% %BACKEND_DIR%
echo %BLUE%Frontend:%NC% %FRONTEND_DIR%
echo.
echo %YELLOW%Admin Credentials:%NC%
echo   Username: admin
echo   Password: admin123
echo.
echo %YELLOW%Access URLs:%NC%
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:8000
echo   Admin Panel: http://localhost:8000/admin
echo.

:: ============================================
:: Step 9: Launch Servers
:: ============================================
echo %BLUE%[9/9] Launching servers...%NC%
echo.
echo %YELLOW%Two terminal windows will open:%NC%
echo   1. Backend Server (Django)
echo   2. Frontend Server (Vite)
echo.
echo %YELLOW%Press Ctrl+C in each window to stop the servers%NC%
echo.
timeout /t 3

:: Launch backend server in new window
echo Starting backend server...
cd "%BACKEND_DIR%"
start "Pregnancy Care - Backend Server" cmd /k "call .venv\Scripts\activate.bat && python manage.py runserver"

:: Wait a moment for backend to start
timeout /t 3 >nul

:: Launch frontend server in new window
echo Starting frontend server...
cd "%FRONTEND_DIR%"
start "Pregnancy Care - Frontend Server" cmd /k "npm run dev"

:: Wait for servers to initialize
echo.
echo %GREEN%Servers are starting...%NC%
echo.
echo %YELLOW%Waiting for servers to initialize (10 seconds)...%NC%
timeout /t 10

:: Open browser
echo.
echo %BLUE%Opening application in browser...%NC%
timeout /t 2 >nul
start http://localhost:5173

echo.
echo %GREEN%========================================%NC%
echo %GREEN% Application is now running!%NC%
echo %GREEN%========================================%NC%
echo.
echo %YELLOW%Next Steps:%NC%
echo   1. The application should open in your browser
echo   2. Login with admin/admin123 to access admin portal
echo   3. Or create a patient account to start exercising
echo.
echo %YELLOW%To stop the servers:%NC%
echo   - Press Ctrl+C in each server window
echo   - Or close the terminal windows
echo.
echo %BLUE%Happy exercising! 🤰💪%NC%
echo.
pause

ENDLOCAL
