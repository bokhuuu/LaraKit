<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Defines the available user roles in the admin panel.
 *
 * Used throughout the application to assign roles via Spatie Permission,
 * restrict access in middleware and services, and display role labels in the UI.
 */
enum UserRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case ADMIN = 'admin';
    case EDITOR = 'editor';
    case VIEWER = 'viewer';

    /**
     * Returns a human-readable label for display in the UI.
     */
    public function label(): string
    {
        return match ($this) {
            UserRole::SUPER_ADMIN => 'Super Admin',
            UserRole::ADMIN => 'Admin',
            UserRole::EDITOR => 'Editor',
            UserRole::VIEWER => 'Viewer',
        };
    }
}
