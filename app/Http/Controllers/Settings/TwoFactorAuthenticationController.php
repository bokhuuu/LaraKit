<?php

declare(strict_types=1);

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\TwoFactorAuthenticationRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

/**
 * Handles the two-factor authentication settings page.
 *
 * Conditionally requires password confirmation before showing
 * 2FA settings, based on the Fortify feature configuration.
 */
class TwoFactorAuthenticationController extends Controller implements HasMiddleware
{
    /**
     * Conditionally applies password confirmation middleware to the show action.
     *
     * Whether confirmation is required is driven by the 'confirmPassword'
     * option in config/fortify.php, so no code change is needed to toggle it.
     */
    public static function middleware(): array
    {
        return Features::optionEnabled(Features::twoFactorAuthentication(), 'confirmPassword')
            ? [new Middleware('password.confirm', only: ['show'])]
            : [];
    }

    /**
     * Show the user's two-factor authentication settings page.
     */
    public function show(TwoFactorAuthenticationRequest $request): Response
    {
        $request->ensureStateIsValid();

        return Inertia::render('settings/two-factor', [
            'twoFactorEnabled' => $request->user()->hasEnabledTwoFactorAuthentication(),
            'requiresConfirmation' => Features::optionEnabled(Features::twoFactorAuthentication(), 'confirm'),
        ]);
    }
}
