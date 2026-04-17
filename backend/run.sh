#!/usr/bin/env bash
# run.sh — Start the RadiLens Spring Boot backend
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=================================================="
echo "   RadiLens — Spring Boot API Gateway"
echo "=================================================="
echo "[start] Building and starting on http://0.0.0.0:8080"
echo ""

./mvnw spring-boot:run
