<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Reads the locale cookie and sets the application locale for the current request.
 *
 * Falls back to the default locale if the cookie is missing or invalid.
 */
class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $available = config('larakit.locales.available');
        $default = config('larakit.locales.default');

        $locale = $request->cookie('locale', $default);

        if (! in_array($locale, $available, strict: true)) {
            $locale = $default;
        }

        app()->setLocale($locale);

        return $next($request);
    }
}
