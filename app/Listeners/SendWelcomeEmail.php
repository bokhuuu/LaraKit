<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\UserCreated;
use App\Mail\WelcomeEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

/**
 * Sends a welcome email to a newly created user.
 *
 * Queued via ShouldQueue so it runs in the background
 * without delaying the HTTP response.
 */
class SendWelcomeEmail implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Sends the WelcomeEmail mailable to the newly created user's email address.
     */
    public function handle(UserCreated $event): void
    {
        Mail::to($event->user->email)->send(new WelcomeEmail($event->user));
    }
}
