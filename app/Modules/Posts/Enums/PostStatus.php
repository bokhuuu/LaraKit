<?php

declare(strict_types=1);

namespace App\Modules\Posts\Enums;

/**
 * Represents the publication status of a post.
 */
enum PostStatus: string
{
    case Draft     = 'draft';
    case Published = 'published';
    case Scheduled = 'scheduled';

    /**
     * Returns a human-readable label for display in the UI.
     */
    public function label(): string
    {
        return match ($this) {
            PostStatus::Draft     => 'Draft',
            PostStatus::Published => 'Published',
            PostStatus::Scheduled => 'Scheduled',
        };
    }

    /**
     * Returns a Tailwind color class for badge styling.
     */
    public function color(): string
    {
        return match ($this) {
            PostStatus::Draft     => 'gray',
            PostStatus::Published => 'green',
            PostStatus::Scheduled => 'yellow',
        };
    }
}
