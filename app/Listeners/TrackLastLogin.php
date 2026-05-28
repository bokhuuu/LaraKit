<?php

declare(strict_types=1);

namespace App\Listeners;

use Illuminate\Auth\Events\Login;

class TrackLastLogin
{
    /**
     * Handle the Login event and record the user's last login details.
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
