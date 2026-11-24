#!/usr/bin/env bash
# BreathePure — Single-Service Unified Build Script for Render
set -o errexit

echo "=========================================================="
echo " Starting BreathePure Single-Service Build on Render"
echo "=========================================================="

# 1. Verify Node.js & npm availability; install if missing
if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Node.js or npm not detected in PATH. Setting up Node.js LTS..."
  export NVM_DIR="$HOME/.nvm"
  if [ ! -d "$NVM_DIR" ]; then
    echo "Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  fi
  # Load nvm
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  nvm install 20
  nvm use 20
fi

echo "Verified Node.js version: $(node -v)"
echo "Verified npm version:     $(npm -v)"
echo "Verified Python version:  $(python3 --version 2>/dev/null || python --version)"

# 2. Build React + Vite Frontend
echo "--- Installing frontend dependencies & building production bundle ---"
cd frontend
npm ci || npm install
npm run build
cd ..

# Ensure frontend/dist/index.html was produced
if [ ! -f "frontend/dist/index.html" ]; then
  echo "ERROR: frontend/dist/index.html was not generated!"
  exit 1
fi
echo "Frontend production build verified in frontend/dist/."

# 3. Install Python Backend Dependencies
echo "--- Installing backend Python dependencies ---"
python -m pip install --upgrade pip
pip install -r backend/requirements.txt

echo "=========================================================="
echo " BreathePure build completed successfully!"
echo "=========================================================="
