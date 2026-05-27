<?php

declare(strict_types=1);

namespace App\Enums\Settings;

/**
 * Defines the tab groups used to organise settings in the admin panel.
 *
 * Each setting belongs to one group, which determines
 * which tab it appears under on the settings page.
 */
enum SettingGroup: string
{
    case GENERAL = 'general';
    case SOCIAL = 'social';
    case SEO = 'seo';
    case MAIL = 'mail';
}
