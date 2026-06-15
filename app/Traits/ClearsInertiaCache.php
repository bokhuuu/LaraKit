<?php

declare(strict_types=1);

namespace App\Traits;

/**
 * Automatically invalidates the Inertia shared data cache when a model is mutated.
 *
 * Inertia caches shared data (site settings, name, favicon) on the frontend.
 * This trait hooks into Eloquent model events so any create, update, or delete
 * triggers a cache bust, ensuring the UI always reflects the latest data
 * without requiring a manual refresh.
 */
trait ClearsInertiaCache
{
    /**
     * Increments the Inertia version key and clears all site-related cache entries.
     *
     * Inertia detects the version change on the next request and reloads shared data.
     */
    public static function invalidateCache(): void
    {
        if (cache()->has('inertia_version')) {
            cache()->increment('inertia_version');
        } else {
            cache()->forever('inertia_version', 1);
        }

        cache()->forget(config('larakit.cache.keys.site_settings'));
        cache()->forget(config('larakit.cache.keys.site_name'));
        cache()->forget(config('larakit.cache.keys.favicon_url'));
        cache()->forget(config('larakit.cache.keys.og_image_url'));
    }

    /**
     * Registers the cache invalidation callback on all mutating model events.
     *
     * Laravel automatically calls boot{TraitName}() when the trait is booted,
     * so any model using this trait gets the behaviour without any extra setup.
     */
    protected static function bootClearsInertiaCache(): void
    {
        $invalidate = fn () => static::invalidateCache();

        static::created($invalidate);
        static::updated($invalidate);
        static::deleted($invalidate);
    }
}
