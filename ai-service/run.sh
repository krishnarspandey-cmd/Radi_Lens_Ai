#!/usr/bin/env bash
# run.sh — Set up virtual environment and start the RadiLens AI Service
set -e

PYTHON=/usr/local/bin/python3.10
VENV_DIR=".venv"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=================================================="
echo "   RadiLens AI — Inference Service Launcher"
echo "=================================================="

# ── Copy .env if it doesn't exist ─────────────────────────────────────────────
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "[setup] Created .env from .env.example"
fi

# ── Create virtual environment ─────────────────────────────────────────────────
if [ ! -d "$VENV_DIR" ]; then
    echo "[setup] Creating virtual environment with $PYTHON …"
    $PYTHON -m venv $VENV_DIR
    echo "[setup] Virtual environment created."
fi

# ── Activate and install ───────────────────────────────────────────────────────
source "$VENV_DIR/bin/activate"

echo "[setup] Installing dependencies …"
pip install --upgrade pip -q
pip install -r requirements.txt -q
echo "[setup] ✅ Dependencies installed."

# ── Start the server ───────────────────────────────────────────────────────────
echo ""
echo "[start] Launching FastAPI server on http://0.0.0.0:8000"
echo "[start] API docs available at http://localhost:8000/docs"
echo ""
python main.py
