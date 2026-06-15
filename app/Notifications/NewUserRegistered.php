<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Notification dispatched to all admins when a new user registers.
 *
 * Delivered through two channels in parallel:
 * - mail → email alert with a direct link to the new user's edit page
 * - database → stored in the notifications table for the bell icon in the panel
 *
 * Queued via ShouldQueue so both channels are processed in the background.
 */
class NewUserRegistered extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private User $user) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(config('larakit.notifications.new_user_subject'))
            ->line("{$this->user->name} ({$this->user->email}) just created an account.")
            ->action('View User', route('admin.users.edit', $this->user->id))
            ->line(config('larakit.notifications.footer'));
    }

    /**
     * Stores the notification payload in the database channel.
     *
     * This array is what the bell icon reads to render each notification
     * in the dropdown - message for display, user_id for the link,
     * event for filtering.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => "{$this->user->name} just registered",
            'user_id' => $this->user->id,
            'event' => 'new_user_registered',
        ];
    }
}
