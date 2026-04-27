<?php

namespace App\Traits;

trait ClearsInertiaCache
{
    protected static function bootClearsInertiaCache(): void
    {
        $invalidate = function () {
            if (cache()->has('inertia_version')) {
                cache()->increment('inertia_version');
            } else {
                cache()->forever('inertia_version', 1);
            }
        };

        static::created($invalidate);
        static::updated($invalidate);
        static::deleted($invalidate);
    }
}
