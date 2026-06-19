#!/bin/bash

# -----------------------------------------------------------------------
# LaraKit Setup Script
# Runs inside the app container after first "docker compose up".
# Usage: docker compose exec app bash scripts/setup.sh
# -----------------------------------------------------------------------

set -e  # Stop immediately if any command fails

echo ""
echo "========================================"
echo "  LaraKit - Fresh Install Setup"
echo "========================================"
echo ""

# -----------------------------------------------------------------------
# Step 1 - Environment file
# Copy .env.example to .env if .env doesn't exist yet.
# -----------------------------------------------------------------------
if [ ! -f .env ]; then
    echo "[1/7] Creating .env from .env.example..."
    cp .env.example .env
else
    echo "[1/7] .env already exists - skipping."
fi

# -----------------------------------------------------------------------
# Step 2 - Application key
# Generates APP_KEY and writes it into .env.
# Required for encryption, sessions, and cookies to work.
# -----------------------------------------------------------------------
echo "[2/7] Generating application key..."
php artisan key:generate

# -----------------------------------------------------------------------
# Step 3 - Database migrations
# Creates all tables from scratch.
# Waits a moment first to ensure MySQL container is fully ready.
# -----------------------------------------------------------------------
echo "[3/7] Running database migrations..."
php artisan migrate --force

# -----------------------------------------------------------------------
# Step 4 - Database seeding
# Seeds roles, permissions, and the default super_admin user.
# -----------------------------------------------------------------------
echo "[4/7] Seeding database..."
php artisan db:seed --force

# -----------------------------------------------------------------------
# Step 5 - Storage symlink
# Links storage/app/public to public/storage.
# Required for uploaded files (avatars, media) to be publicly accessible.
# -----------------------------------------------------------------------
echo "[5/7] Linking storage..."
php artisan storage:link

# -----------------------------------------------------------------------
# Step 6 - Frontend assets
# Assets are built on the host machine, not inside the container.
# Run manually before starting Docker: npm install && npm run build
# -----------------------------------------------------------------------
echo "[6/7] Skipping npm build - run 'npm install && npm run build' on your machine before starting Docker."

# -----------------------------------------------------------------------
# Step 7 - Fix permissions
# Volume mounts override Dockerfile permissions on the host machine.
# This ensures www-data can write to storage and tmp on every fresh start.
# -----------------------------------------------------------------------
echo "[7/8] Fixing permissions..."
chmod -R 777 /tmp
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# -----------------------------------------------------------------------
# Step 8 - Cache
# Clears any stale config, route, or view cache from previous runs.
# -----------------------------------------------------------------------
echo "[8/8] Clearing cache..."
php artisan optimize:clear