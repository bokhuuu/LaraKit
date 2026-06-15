# Production Checklist

Run through this checklist before going live with LaraKit.
Every item must be confirmed before the application handles real traffic.

---

## Environment

- [ ] `APP_ENV=production`
- [ ] `APP_DEBUG=false` - never expose errors publicly
- [ ] `APP_KEY` is set and unique - run `php artisan key:generate` if not
- [ ] `APP_URL` matches your actual domain with `https://`
- [ ] `.env` is not committed to version control
- [ ] `.env.example` has all keys documented with no real values

---

## Database

- [ ] Database user has only the permissions it needs (no root in production)
- [ ] `DB_PASSWORD` is a strong random password
- [ ] Migrations have been run - `php artisan migrate --force`
- [ ] Database is backed up regularly (daily minimum)
- [ ] Database is not exposed to the public internet (firewall blocks port 3306)

---

## Security

- [ ] `APP_DEBUG=false` (listed again - this one is critical)
- [ ] HTTPS is enabled and HTTP redirects to HTTPS
- [ ] SSL certificate is valid and auto-renewing (Certbot)
- [ ] `BCRYPT_ROUNDS=12` or higher
- [ ] `SESSION_SECURE_COOKIE=true` in production (add to .env)
- [ ] Firewall configured - only ports 80, 443, and 22 open
- [ ] SSH root login disabled
- [ ] Strong SSH password or key-based authentication only
- [ ] `TELESCOPE_ENABLED=false` or access restricted via `TELESCOPE_ACCESS_EMAIL`
- [ ] `LARAKIT_MAINTENANCE_SECRET` is set to a strong random string

---

## Mail

- [ ] `MAIL_MAILER` is set to a real provider (smtp, mailgun, resend, ses)
- [ ] `MAIL_FROM_ADDRESS` uses your actual domain
- [ ] Test email sending works - `php artisan tinker` → `Mail::raw('test', fn($m) => $m->to('you@example.com'))`

---

## Queue & Horizon

- [ ] `QUEUE_CONNECTION=redis`
- [ ] `REDIS_HOST=127.0.0.1` (not localhost - use IP on production)
- [ ] Horizon is running as a persistent process (Supervisor)
- [ ] `php artisan horizon:status` returns `running`
- [ ] Failed jobs are monitored - check `/horizon` dashboard
- [ ] Horizon is restarted after every deployment - `php artisan horizon:terminate`

---

## Cache & Performance

- [ ] `php artisan optimize` has been run (caches config, routes, views)
- [ ] `CACHE_STORE=redis` in production for better performance
- [ ] Opcache is enabled in PHP configuration
- [ ] Frontend assets are built - `npm run build`

---

## Storage & Media

- [ ] `php artisan storage:link` has been run
- [ ] Storage directory is writable by the web server
- [ ] Media uploads are working (test avatar upload)
- [ ] If using S3 - `FILESYSTEM_DISK=s3` and AWS credentials are set

---

## Error Tracking

- [ ] `SENTRY_LARAVEL_DSN` is set to your real Sentry DSN
- [ ] Test Sentry is receiving errors - trigger a test exception
- [ ] `SENTRY_TRACES_SAMPLE_RATE` is appropriate for your traffic (0.1 = 10%)

---

## Logging

- [ ] `LOG_LEVEL=error` in production to reduce noise
- [ ] Log files are rotated - `LOG_CHANNEL=daily` recommended for production
- [ ] Logs are not publicly accessible

---

## Final Checks

- [ ] Visit the app in an incognito window - confirm login works
- [ ] Create a test user - confirm welcome email is sent
- [ ] Upload an avatar - confirm media library works
- [ ] Check `/horizon` dashboard - confirm jobs are processing
- [ ] Check `/telescope` is not publicly accessible
- [ ] Run the full Pest test suite one final time - `php artisan test`
- [ ] Check all sidebar links work for each role (super_admin, admin, editor)
