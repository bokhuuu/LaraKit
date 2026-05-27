<?php

declare(strict_types=1);

namespace App\Enums\Settings;

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
