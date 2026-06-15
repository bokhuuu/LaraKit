# VPS Deployment Guide

This guide covers deploying LaraKit to a Ubuntu 22.04 VPS from scratch.
Commands use `apt` - for CentOS/RHEL replace `apt` with `dnf`.

---

## Prerequisites

- A VPS running Ubuntu 22.04 (DigitalOcean, Hetzner, Linode, etc.)
- A domain name pointed to your server's IP
- SSH access to the server as root or a sudo user

---

## 1. Connect to Your Server

```bash
ssh root@your-server-ip
```

---

## 2. Create a Non-Root User

Never run your app as root.

```bash
adduser larakit
usermod -aG sudo larakit
su - larakit
```

---

## 3. Install Dependencies

```bash
sudo apt update && sudo apt upgrade -y

# Install PHP 8.4
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.4-fpm php8.4-mysql php8.4-redis php8.4-mbstring \
    php8.4-xml php8.4-zip php8.4-gd php8.4-bcmath php8.4-curl php8.4-pcntl

# Install Nginx
sudo apt install -y nginx

# Install MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Install Redis
sudo apt install -y redis-server
sudo systemctl enable redis-server

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt install -y nodejs
```

---

## 4. Configure MySQL

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE larakit;
CREATE USER 'larakit'@'localhost' IDENTIFIED BY 'your-strong-password';
GRANT ALL PRIVILEGES ON larakit.* TO 'larakit'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 5. Clone the Repository

```bash
cd /var/www
sudo git clone https://github.com/bokhuuu/LaraKit.git larakit
sudo chown -R larakit:larakit /var/www/larakit
cd /var/www/larakit
```

---

## 6. Configure Environment

```bash
cp .env.example .env
nano .env
```

Update these values for production:

```env
APP_NAME=LaraKit
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
APP_TIMEZONE=UTC

DB_HOST=127.0.0.1
DB_DATABASE=larakit
DB_USERNAME=larakit
DB_PASSWORD=your-strong-password

REDIS_HOST=127.0.0.1
QUEUE_CONNECTION=redis
CACHE_STORE=redis

MAIL_MAILER=smtp
MAIL_HOST=your-mail-host
MAIL_PORT=587
MAIL_USERNAME=your-mail-username
MAIL_PASSWORD=your-mail-password
MAIL_FROM_ADDRESS=hello@yourdomain.com

TELESCOPE_ENABLED=true
TELESCOPE_ACCESS_EMAIL=your-admin-email@yourdomain.com

LARAKIT_MAINTENANCE_SECRET=your-strong-random-secret
LARAKIT_NOTIFICATION_FOOTER="This is an automated notification from LaraKit."
LARAKIT_WELCOME_EMAIL_SUBJECT="Welcome to LaraKit"

SENTRY_LARAVEL_DSN=your-sentry-dsn
SENTRY_TRACES_SAMPLE_RATE=0.1
```

---

## 7. Install Dependencies and Build

```bash
composer install --no-interaction --prefer-dist --optimize-autoloader
npm install
npm run build
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force  # Only on fresh install - skip if data already exists
php artisan storage:link
php artisan optimize
```

---

## 8. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/larakit
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/larakit/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/larakit /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 9. Set Permissions

```bash
sudo chown -R www-data:www-data /var/www/larakit/storage
sudo chown -R www-data:www-data /var/www/larakit/bootstrap/cache
sudo chmod -R 775 /var/www/larakit/storage
sudo chmod -R 775 /var/www/larakit/bootstrap/cache
```

---

## 10. Configure SSL with Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo systemctl reload nginx
```

Certbot automatically renews certificates. Verify auto-renewal:

```bash
sudo certbot renew --dry-run
```

---

## 11. Set Up Laravel Horizon as a System Service

Horizon must run as a persistent background process. Use Supervisor to manage it.

```bash
sudo apt install -y supervisor
sudo nano /etc/supervisor/conf.d/larakit-horizon.conf
```

```ini
[program:larakit-horizon]
process_name=%(program_name)s
command=php /var/www/larakit/artisan horizon
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/www/larakit/storage/logs/horizon.log
stopwaitsecs=3600
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start larakit-horizon
```

---

## 12. Configure Queue Worker Restart on Deploy

After each deployment, restart Horizon gracefully so it picks up new code:

```bash
php artisan horizon:terminate
```

Supervisor will automatically restart it.

---

## 13. Verify Everything is Running

```bash
# PHP-FPM
sudo systemctl status php8.4-fpm

# Nginx
sudo systemctl status nginx

# Redis
sudo systemctl status redis-server

# MySQL
sudo systemctl status mysql

# Horizon
sudo supervisorctl status larakit-horizon
```

---

## Updating the Application

After pushing new code to the server:

```bash
cd /var/www/larakit
git pull origin main
composer install --no-interaction --prefer-dist --optimize-autoloader
npm install
npm run build
php artisan migrate --force
php artisan optimize
php artisan horizon:terminate
```
