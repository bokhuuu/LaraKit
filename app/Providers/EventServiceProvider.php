<?php

declare(strict_types=1);

namespace App\Providers;

use App\Events\UserCreated;
use App\Listeners\SendWelcomeEmail;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

/**
 * Registers event-to-listener mappings for the application.
 *
 * Note: NotifyAdminsOfNewUser is auto-discovered by Laravel
 * and does not need to be listed here manually.
 */
class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        UserCreated::class => [
            SendWelcomeEmail::class,
        ],
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
