<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Handles locale switching for the admin panel.
 *
 * Validates the requested locale against the supported list in config,
 * then persists the choice in a permanent cookie read by SetLocale middleware.
 */
class LocaleController extends Controller
{
    /**
     * Validates the requested locale and stores it as a permanent cookie.
     *
     * Aborts with 422 if the locale is not in config('larakit.locales.available').
     */
    public function update(Request $request): RedirectResponse
    {
        $available = config('larakit.locales.available');
        $locale = $request->input('locale');

        if (! in_array($locale, $available, strict: true)) {
            abort(422);
        }

        return redirect()->back()->withCookie(
            cookie()->forever('locale', $locale)
        );
    }
}
