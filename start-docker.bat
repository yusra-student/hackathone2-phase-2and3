@echo off
REM Batch script to build and run the Todo App with Docker on Windows

echo Building and running Todo App with Docker...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo Docker is not installed. Please install Docker Desktop first.
    exit /b 1
)

echo Building the services...
docker compose build

if errorlevel 1 (
    echo Build failed. Please check the error messages above.
    exit /b 1
)

echo Starting the services...
docker compose up -d

if errorlevel 0 (
    echo.
    echo Services are now running:
    echo.   - Frontend: http://localhost:3000
    echo.   - Backend: http://localhost:7860
    echo.   - Database: localhost:5432 (internal use)
    echo.
    echo To view logs: docker compose logs -f
    echo To stop services: docker compose down
) else (
    echo Failed to start services.
    exit /b 1
)