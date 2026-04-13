<?php

namespace App\Enums;

enum UserRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case ADMIN = 'admin';
    case EDITOR = 'editor';
    case VIEWER = 'viewer';

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
