<?php

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
