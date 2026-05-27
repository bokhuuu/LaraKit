<?php

declare(strict_types=1);

namespace App\Enums\Settings;

/**
 * Defines the input types available for site settings.
 *
 * Used in the settings seeder and frontend to determine
 * how each setting value is rendered and edited.
 */
enum SettingType: string
{
    case TEXT = 'text';
    case FILE = 'file';
    case BOOLEAN = 'boolean';
    case COLOR = 'color';
    case URL = 'url';
    case EMAIL = 'email';
    case TEXTAREA = 'textarea';
}
