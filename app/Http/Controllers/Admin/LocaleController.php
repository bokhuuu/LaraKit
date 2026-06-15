<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Handles locale switching for the admin panel.
 */
class LocaleController extends Controller
{
    /**
     * Store the selected locale in a cookie and redirect back.
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
