<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Handles marking notifications as read for the authenticated user.
 *
 * No service layer is needed here - there is no business logic,
 * just direct operations on the user's notification relationships
 * provided by Laravel's Notifiable trait.
 */
class NotificationController extends Controller
{
    /**
     * Marks a single notification as read by its ID.
     *
     * Uses findOrFail to prevent users from marking
     * notifications that don't belong to them.
     */
    public function markAsRead(Request $request, string $id): RedirectResponse
    {
        $notification = $request->user()
            ->notifications()
            ->findOrFail($id);

        $notification->markAsRead();

        return back();
    }

    public function markAllAsRead(Request $request): RedirectResponse
    {
        $request->user()
            ->unreadNotifications()
            ->update(['read_at' => now()]);

        return back();
    }
}
