<?php

namespace Database\Seeders\Settings;

use App\Enums\Settings\SettingGroup;
use App\Enums\Settings\SettingType;
use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'site_name', 'value' => 'LaraKit', 'group' => SettingGroup::GENERAL->value, 'type' => SettingType::TEXT->value, 'label' => 'Site Name', 'description' => 'The name of your website', 'order' => 1],
            ['key' => 'site_email', 'value' => '', 'group' => SettingGroup::GENERAL->value, 'type' => SettingType::EMAIL->value, 'label' => 'Site Email', 'description' => 'Main contact email', 'order' => 2],
            ['key' => 'site_phone', 'value' => '', 'group' => SettingGroup::GENERAL->value, 'type' => SettingType::TEXT->value, 'label' => 'Site Phone', 'description' => 'Main contact phone', 'order' => 3],
            ['key' => 'site_address', 'value' => '', 'group' => SettingGroup::GENERAL->value, 'type' => SettingType::TEXTAREA->value, 'label' => 'Address', 'description' => 'Physical address', 'order' => 4],
            ['key' => 'site_description', 'value' => '', 'group' => SettingGroup::GENERAL->value, 'type' => SettingType::TEXTAREA->value, 'label' => 'Description', 'description' => 'Short site description', 'order' => 5],
            ['key' => 'site_logo', 'value' => '', 'group' => SettingGroup::GENERAL->value, 'type' => SettingType::FILE->value, 'label' => 'Logo', 'description' => 'JPG, PNG or WebP. Max 2MB.', 'order' => 6],
            ['key' => 'site_favicon', 'value' => '', 'group' => SettingGroup::GENERAL->value, 'type' => SettingType::FILE->value, 'label' => 'Favicon', 'description' => 'ICO, PNG. Max 512KB.', 'order' => 7],

            ['key' => 'facebook_url', 'value' => '', 'group' => SettingGroup::SOCIAL->value, 'type' => SettingType::URL->value, 'label' => 'Facebook', 'description' => 'Facebook page URL', 'order' => 1],
            ['key' => 'instagram_url', 'value' => '', 'group' => SettingGroup::SOCIAL->value, 'type' => SettingType::URL->value, 'label' => 'Instagram', 'description' => 'Instagram page URL', 'order' => 2],
            ['key' => 'twitter_url', 'value' => '', 'group' => SettingGroup::SOCIAL->value, 'type' => SettingType::URL->value, 'label' => 'Twitter', 'description' => 'Twitter page URL', 'order' => 3],
            ['key' => 'youtube_url', 'value' => '', 'group' => SettingGroup::SOCIAL->value, 'type' => SettingType::URL->value, 'label' => 'YouTube', 'description' => 'YouTube channel URL', 'order' => 4],
            ['key' => 'linkedin_url', 'value' => '', 'group' => SettingGroup::SOCIAL->value, 'type' => SettingType::URL->value, 'label' => 'LinkedIn', 'description' => 'LinkedIn page URL', 'order' => 5],

            ['key' => 'meta_title', 'value' => '', 'group' => SettingGroup::SEO->value, 'type' => SettingType::TEXT->value, 'label' => 'Meta Title', 'description' => 'Default page title', 'order' => 1],
            ['key' => 'meta_description', 'value' => '', 'group' => SettingGroup::SEO->value, 'type' => SettingType::TEXTAREA->value, 'label' => 'Meta Description', 'description' => 'Default meta description', 'order' => 2],
            ['key' => 'meta_keywords', 'value' => '', 'group' => SettingGroup::SEO->value, 'type' => SettingType::TEXT->value, 'label' => 'Meta Keywords', 'description' => 'Default meta keywords', 'order' => 3],
            ['key' => 'og_image', 'value' => '', 'group' => SettingGroup::SEO->value, 'type' => SettingType::FILE->value, 'label' => 'OG Image', 'description' => 'JPG, PNG. Recommended 1200x630px. Max 2MB.', 'order' => 4],

            ['key' => 'mail_from_name', 'value' => 'LaraKit', 'group' => SettingGroup::MAIL->value, 'type' => SettingType::TEXT->value, 'label' => 'From Name', 'description' => 'Email sender name', 'order' => 1],
            ['key' => 'mail_from_address', 'value' => '', 'group' => SettingGroup::MAIL->value, 'type' => SettingType::EMAIL->value, 'label' => 'From Address', 'description' => 'Email sender address', 'order' => 2],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
