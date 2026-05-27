<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\UserCreated;
use App\Models\User;
use App\Notifications\NewUserRegistered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Notification;

class NotifyAdminsOfNewUser implements ShouldQueue
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
        $admins = User::role(['super_admin', 'admin'])->get();

        Notification::send($admins, new NewUserRegistered($event->user));
    }
}
