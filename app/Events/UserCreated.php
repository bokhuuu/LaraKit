<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Fired when a new user is successfully created.
 *
 * Carries the newly created user to all registered listeners.
 * Dispatched from UserService::store() after the user is persisted.
 *
 * Listeners:
 * - SendWelcomeEmail → sends a welcome email to the new user
 * - NotifyAdminsOfNewUser → notifies all admins via database and email
 */
class UserCreated
{
    use Dispatchable, SerializesModels;

    public User $user;

    /**
     * Create a new event instance.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }
}
