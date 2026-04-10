#!/bin/bash

# Interactive build script for Elk Draw Analyzer
# Prompts user for build scenario and executes appropriate commands

set -e

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$APP_DIR"

echo "================================"
echo "Elk Draw Analyzer Build Tool"
echo "================================"
echo ""

# Display menu
show_menu() {
    echo "Select a build scenario:"
    echo ""
    echo "  1) Development Server (with hot reload)"
    echo "  2) Production Build Only"
    echo "  3) Production Build + Preview"
    echo "  4) Run All Tests"
    echo "  5) Run Tests (watch mode)"
    echo "  6) Type Check"
    echo "  7) Clean Build (delete dist/ and rebuild)"
    echo "  8) Full Build Pipeline (test + typecheck + build)"
    echo "  9) Full Build Pipeline + Start Server"
    echo " 10) Docker: Build Image"
    echo " 11) Docker: Start Container (docker compose up)"
    echo " 12) Docker: Stop Container (docker compose down)"
    echo " 13) Docker: View Logs"
    echo ""
    echo "  Git:"
    echo " 14) Git: Commit (stage all + prompt for message)"
    echo " 15) Git: Commit + Push"
    echo ""
    echo " 16) Exit"
    echo ""
    read -p "Enter your choice (1-16): " choice
}

# Function to run dev server
run_dev() {
    echo ""
    echo "Starting development server on port 3456..."
    echo "Visit: http://localhost:3456"
    echo ""
    pnpm dev
}

# Function to build production
run_build() {
    echo ""
    echo "Building for production..."
    pnpm build
    echo ""
    echo "✓ Production build complete!"
    echo "  Output directory: dist/"
}

# Function to build and preview
run_build_and_preview() {
    echo ""
    echo "Building for production..."
    pnpm build
    echo "✓ Production build complete!"
    echo ""
    echo "Starting preview server on port 3456..."
    echo "Visit: http://localhost:3456"
    echo ""
    pnpm preview
}

# Function to run all tests
run_tests() {
    echo ""
    echo "Running all tests..."
    pnpm test
    echo ""
    echo "✓ All tests passed!"
}

# Function to run tests in watch mode
run_tests_watch() {
    echo ""
    echo "Running tests in watch mode..."
    echo "Press Ctrl+C to exit"
    echo ""
    pnpm test:watch
}

# Function to typecheck
run_typecheck() {
    echo ""
    echo "Running TypeScript type check..."
    pnpm typecheck
    echo ""
    echo "✓ Type check passed!"
}

# Function to clean and rebuild
run_clean_build() {
    echo ""
    echo "Cleaning dist/ directory..."
    rm -rf dist/
    echo "✓ Cleaned"
    echo ""
    echo "Building for production..."
    pnpm build
    echo ""
    echo "✓ Clean production build complete!"
}

# Function to run full pipeline
run_full_pipeline() {
    echo ""
    echo "Starting full build pipeline..."
    echo ""

    echo "[1/3] Running tests..."
    pnpm test
    echo "✓ Tests passed"
    echo ""

    echo "[2/3] Type checking..."
    pnpm typecheck
    echo "✓ Type check passed"
    echo ""

    echo "[3/3] Building for production..."
    pnpm build
    echo "✓ Production build complete"
    echo ""

    echo "================================"
    echo "✓ Full build pipeline complete!"
    echo "================================"
    echo "Output directory: dist/"
}

# Function to run full pipeline and start server
run_full_pipeline_and_serve() {
    run_full_pipeline
    echo ""
    echo "Starting preview server on port 3456..."
    echo "Visit: http://localhost:3456"
    echo ""
    pnpm preview
}

# Function to build Docker image
docker_build() {
    echo ""
    echo "Building Docker image..."
    docker compose build
    echo ""
    echo "✓ Docker image built!"
    echo "  Image: hunting-elk-analyzer"
}

# Function to start Docker container
docker_start() {
    echo ""
    echo "Starting Docker container..."
    docker compose up -d
    echo ""
    sleep 3
    echo "✓ Container started!"
    echo "  App available at: http://localhost:3456"
    docker compose ps
}

# Function to stop Docker container
docker_stop() {
    echo ""
    echo "Stopping Docker container..."
    docker compose down
    echo ""
    echo "✓ Container stopped!"
}

# Function to view Docker logs
docker_logs() {
    echo ""
    echo "Docker container logs (Ctrl+C to exit):"
    echo ""
    docker compose logs -f
}

# Function to commit all staged changes
git_commit() {
    echo ""
    git status --short
    echo ""
    read -p "Commit message: " msg
    if [ -z "$msg" ]; then
        echo "Aborted: commit message cannot be empty."
        exit 1
    fi
    git add -A
    git commit -m "$msg"
    echo ""
    echo "✓ Committed!"
}

# Function to commit and push
git_commit_and_push() {
    git_commit
    echo ""
    echo "Pushing to remote..."
    git push
    echo "✓ Pushed!"
}

# Main logic
show_menu

case $choice in
    1)
        run_dev
        ;;
    2)
        run_build
        ;;
    3)
        run_build_and_preview
        ;;
    4)
        run_tests
        ;;
    5)
        run_tests_watch
        ;;
    6)
        run_typecheck
        ;;
    7)
        run_clean_build
        ;;
    8)
        run_full_pipeline
        ;;
    9)
        run_full_pipeline_and_serve
        ;;
    10)
        docker_build
        ;;
    11)
        docker_start
        ;;
    12)
        docker_stop
        ;;
    13)
        docker_logs
        ;;
    14)
        git_commit
        ;;
    15)
        git_commit_and_push
        ;;
    16)
        echo ""
        echo "Goodbye!"
        exit 0
        ;;
    *)
        echo "Invalid choice. Please enter a number between 1-16."
        exit 1
        ;;
esac

echo ""
echo "Done!"
