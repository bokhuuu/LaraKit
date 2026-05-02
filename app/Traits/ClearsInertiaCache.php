<?php

namespace App\Traits;

trait ClearsInertiaCache
{
    public static function invalidateCache(): void
    {
        if (cache()->has('inertia_version')) {
            cache()->increment('inertia_version');
        } else {
            cache()->forever('inertia_version', 1);
        }

        cache()->forget('site_settings');
        cache()->forget('site_name');
        cache()->forget('favicon_url');
        cache()->forget('og_image_url');
    }

    protected static function bootClearsInertiaCache(): void
    {
        $invalidate = fn() => static::invalidateCache();

        static::created($invalidate);
        static::updated($invalidate);
        static::deleted($invalidate);
    }
}
