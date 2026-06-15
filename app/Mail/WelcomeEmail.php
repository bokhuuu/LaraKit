<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Mailable sent to a newly created user upon account creation.
 *
 * Queued via the Queueable trait so it runs through Redis/Horizon
 * without blocking the HTTP response. Uses a Markdown template
 * at resources/views/emails/welcome.blade.php.
 */
class WelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public User $user) {}

    /**
     * Defines the email subject, pulled from config so it stays brand-agnostic.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: config('larakit.notifications.welcome_email_subject'),
        );
    }

    /**
     * Points to the Markdown Blade template used to render the email body.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.welcome',
        );
    }
}
