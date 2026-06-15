FROM php:8.4-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libjpeg-dev \
    libwebp-dev \
    zip \
    unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configure and install PHP extensions
# GD is configured separately to enable JPEG and WebP support
RUN docker-php-ext-configure gd --with-jpeg --with-webp \
    && docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    xml

# Install Redis extension via PECL
RUN pecl install redis && docker-php-ext-enable redis

# Suppress PHP notices to prevent Laravel from converting them to exceptions.
# tempnam() throws an E_NOTICE when falling back to /tmp — harmless but fatal in debug mode.
RUN echo "error_reporting = E_ALL & ~E_NOTICE & ~E_DEPRECATED" > /usr/local/etc/php/conf.d/error-reporting.ini

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Set correct permissions
# 775 allows www-data group to write to storage and cache
# 777 on /tmp ensures Laravel can write temporary files
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache \
    && chmod -R 777 /tmp

EXPOSE 9000

CMD ["php-fpm"]