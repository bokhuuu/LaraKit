# Production Checklist

Run through this checklist before going live with LaraKit.
LaraKit ships as a Docker stack (`docker-compose.yml` — app, Nginx, MySQL, Redis, Horizon).
Every item must be confirmed before the application handles real traffic.

---

## Environment

- [ ] `APP_ENV=production`
- [ ] `APP_DEBUG=false` - never expose errors publicly
- [ ] `APP_KEY` is set and unique - run `docker compose exec app php artisan key:generate` if not
- [ ] `APP_URL` matches your actual domain with `https://`
- [ ] `.env` is not committed to version control
- [ ] `.env.example` has all keys documented with no real values
- [ ] `DB_HOST=mysql` and `REDIS_HOST=redis` - Docker service names, not `127.0.0.1`

---

## Database

- [ ] Database user has only the permissions it needs (avoid using root in production where possible)
- [ ] `DB_PASSWORD` is a strong random password
- [ ] Migrations have been run - `docker compose exec app php artisan migrate --force`
- [ ] The `mysql_data` Docker volume is backed up regularly (daily minimum)
- [ ] MySQL's container port (3307 on the host, mapped from 3306) is not exposed to the public internet - firewall blocks it or remove the host port mapping entirely if no external access is needed

---

## Security

- [ ] `APP_DEBUG=false` (listed again - this one is critical)
- [ ] HTTPS is enabled and HTTP redirects to HTTPS at the host-level reverse proxy
- [ ] SSL certificate is valid and auto-renewing (Certbot on the host, not inside a container)
- [ ] `BCRYPT_ROUNDS=12` or higher
- [ ] `SESSION_SECURE_COOKIE=true` in production (add to .env)
- [ ] Host firewall configured - only ports 80, 443, and 22 open; Docker-internal ports (8080, 3307) are not exposed beyond what's needed
- [ ] SSH root login disabled
- [ ] Strong SSH password or key-based authentication only
- [ ] `TELESCOPE_ENABLED=false` or access restricted via `TELESCOPE_ACCESS_EMAIL`
- [ ] `LARAKIT_MAINTENANCE_SECRET` is set to a strong random string

---

## Mail

- [ ] `MAIL_MAILER` is set to a real provider (smtp, mailgun, resend, ses)
- [ ] `MAIL_FROM_ADDRESS` uses your actual domain
- [ ] Test email sending works - `docker compose exec app php artisan tinker` → `Mail::raw('test', fn($m) => $m->to('you@example.com'))`

---

## Queue & Horizon

- [ ] `QUEUE_CONNECTION=redis`
- [ ] `REDIS_HOST=redis` (the Docker service name, not localhost or an IP)
- [ ] The `larakit_horizon` container is running - `docker compose ps`
- [ ] `restart: unless-stopped` is set on the `horizon` service so it survives crashes and reboots
- [ ] `docker compose exec app php artisan horizon:status` returns `running`
- [ ] Failed jobs are monitored - check `/horizon` dashboard
- [ ] Horizon is restarted after every deployment - `docker compose restart horizon`

---

## Cache & Performance

- [ ] `docker compose exec app php artisan optimize` has been run (caches config, routes, views)
- [ ] `CACHE_STORE=redis` in production for better performance
- [ ] Opcache is enabled in the PHP image - check `docker/php/Dockerfile` includes the opcache extension and a production-tuned `opcache.ini`
- [ ] Frontend assets are built - `docker compose exec app npm run build`

---

## Storage & Media

- [ ] `docker compose exec app php artisan storage:link` has been run
- [ ] Storage directory permissions are correct inside the container - `docker compose exec app chown -R www-data:www-data storage bootstrap/cache` if needed
- [ ] Media uploads are working (test avatar upload)
- [ ] If using S3 - `FILESYSTEM_DISK=s3` and AWS credentials are set
- [ ] If not using S3 - the storage volume persists across container restarts (verify it's not relying on the container's writable layer alone)

---

## Error Tracking

- [ ] `SENTRY_LARAVEL_DSN` is set to your real Sentry DSN
- [ ] Test Sentry is receiving errors - trigger a test exception
- [ ] `SENTRY_TRACES_SAMPLE_RATE` is appropriate for your traffic (0.1 = 10%)

---

## Logging

- [ ] `LOG_LEVEL=error` in production to reduce noise
- [ ] Log files are rotated - `LOG_CHANNEL=daily` recommended for production
- [ ] Container logs are accessible for debugging - `docker compose logs -f app`
- [ ] Logs are not publicly accessible

---

## Final Checks

- [ ] Visit the app in an incognito window - confirm login works
- [ ] Create a test user - confirm welcome email is sent
- [ ] Upload an avatar - confirm media library works
- [ ] Check `/horizon` dashboard - confirm jobs are processing
- [ ] Check `/telescope` is not publicly accessible
- [ ] Run the full Pest test suite one final time - `docker compose exec app php artisan test`
- [ ] Check all sidebar links work for each role (super_admin, admin, editor)
- [ ] Confirm all five containers restart cleanly after a host reboot - `sudo reboot`, then `docker compose ps`
