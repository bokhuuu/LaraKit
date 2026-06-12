#!/bin/bash

# Regenerate Wayfinder type definitions and restore form helpers
# that Wayfinder 0.1.7 no longer generates.
# Run this script instead of `php artisan wayfinder:generate` directly.

php artisan wayfinder:generate

git checkout 4589bda -- resources/js/actions/App/Http/Controllers/
git checkout 4589bda -- resources/js/actions/Laravel/
git checkout 4589bda -- resources/js/actions/Illuminate/
git checkout 4589bda -- resources/js/actions/Inertia/
git checkout 4589bda -- resources/js/routes/

echo "✓ Wayfinder regenerated and form helpers restored."