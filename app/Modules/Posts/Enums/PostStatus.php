<?php

declare(strict_types=1);

namespace App\Modules\Posts\Enums;

/**
 * Defines the publication states a post can be in.
 *
 * Carries display logic for labels and badge colors so status
 * presentation is defined once on the enum rather than scattered across views.
 */
enum PostStatus: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Scheduled = 'scheduled';

    /**
     * Returns a human-readable label for display in the UI.
     */
    public function label(): string
    {
        return match ($this) {
            PostStatus::Draft => 'Draft',
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
            PostStatus::Draft => 'gray',
            PostStatus::Published => 'green',
            PostStatus::Scheduled => 'yellow',
        };
    }
}
