<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Enums\UserRole;
use App\Events\UserCreated;
use App\Models\User;
use App\Notifications\NewUserRegistered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Notification;

/**
 * Sends a NewUserRegistered notification to all admins when a user is created.
 *
 * Queued via ShouldQueue so it runs in the background
 * without delaying the HTTP response.
 */
class NotifyAdminsOfNewUser implements ShouldQueue
{
    /**
     * Fetches all admin and super admin users and dispatches
     * the NewUserRegistered notification to each of them.
     */
    public function handle(UserCreated $event): void
    {
        $admins = User::role([UserRole::SUPER_ADMIN->value, UserRole::ADMIN->value])->get();

        Notification::send($admins, new NewUserRegistered($event->user));
    }
}
