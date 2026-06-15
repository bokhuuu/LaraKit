<?php

declare(strict_types=1);

namespace App\Listeners;

use Illuminate\Auth\Events\Login;

/**
 * Records the timestamp, IP address and user agent whenever a user logs in.
 *
 * Attached to Laravel's built-in Login event, which fires automatically
 * after every successful authentication.
 */
class TrackLastLogin
{
    /**
     * Saves the current login details to the authenticated user's record.
     */
    public function handle(Login $event): void
    {
        $event->user->update([
            'last_login_at' => now(),
            'last_login_ip' => request()->ip(),
            'last_login_agent' => request()->userAgent(),
        ]);
    }
}
