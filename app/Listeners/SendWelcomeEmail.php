<?php

namespace App\Listeners;

use App\Events\UserCreated;

class SendWelcomeEmail
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(UserCreated $event): void
    {
        $user = $event->user;

        \Log::info('Welcome email should be sent to: ' . $user->email);
    }
}
