<?php

declare(strict_types=1);

namespace App\Enums\Settings;

enum SettingGroup: string
{
    case GENERAL = 'general';
    case SOCIAL = 'social';
    case SEO = 'seo';
    case MAIL = 'mail';
}
