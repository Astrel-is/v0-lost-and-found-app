#!/usr/bin/env bash
set -e

echo "  Vault Church Security System - Setup"
echo "========================================"
echo ""

# 1. Install dependencies
echo "[1/4] Installing dependencies..."
pnpm install

# 2. Set up database
echo "[2/4] Setting up database..."
pnpm db:migrate

# 3. Seed default users
echo "[3/4] Seeding default users..."
pnpm db:seed

# 4. Start dev server
echo "[4/4] Starting dev server..."
echo ""
echo "========================================"
echo " Default Credentials:"
echo "   Admin:     admin / SecureAdmin123!"
echo "   Volunteer: tomanderson / VolunteerPass123!"
echo "   User:      johndoe / UserPass123!"
echo "========================================"
echo ""
echo " Opening http://localhost:3000 ..."
echo ""

pnpm dev
