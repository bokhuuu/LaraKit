<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    | Default number of items per page across all admin listings.
    | Override via .env to tune per environment without touching code.
    */
    'pagination' => env('LARAKIT_PAGINATION', 10),

    /*
    |--------------------------------------------------------------------------
    | Cache
    |--------------------------------------------------------------------------
    | TTL in seconds for cached datasets and the key names used to store them.
    | Centralised here to avoid mismatches between cache set and forget calls.
    */
    'cache' => [
        'site_settings_ttl' => env('LARAKIT_SETTINGS_CACHE_TTL', 3600),
        'keys' => [
            'site_settings' => 'site_settings',
            'site_name'     => 'site_name',
            'favicon_url'   => 'favicon_url',
            'og_image_url'  => 'og_image_url',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Media Collections
    |--------------------------------------------------------------------------
    | Spatie Media Library collection names used across the application.
    | Change here to rename a collection without touching any other file.
    */
    'media' => [
        'disk'               => env('LARAKIT_MEDIA_DISK', 'public'),
        'avatar_collection'  => 'avatar',
        'logo_collection'    => 'site_logo',
        'favicon_collection' => 'site_favicon',
    ],

    /*
    |--------------------------------------------------------------------------
    | Notifications
    |--------------------------------------------------------------------------
    | Subject lines, footer text and limits for outgoing notifications.
    | Override via .env to customise per project without touching code.
    */
    'notifications' => [
        'new_user_subject' => env('LARAKIT_NEW_USER_SUBJECT', 'New User Registered'),
        'footer'                => env('LARAKIT_NOTIFICATION_FOOTER', ''),
        'unread_limit'     => env('LARAKIT_UNREAD_NOTIFICATIONS_LIMIT', 10),
        'welcome_email_subject' => env('LARAKIT_WELCOME_EMAIL_SUBJECT', 'Welcome'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Telescope Access Email
    |--------------------------------------------------------------------------
    | The email address allowed to access Telescope in non-local environments.
    | Set this in your .env file. Leave empty to disable access entirely.
    */
    'telescope_access_email' => env('TELESCOPE_ACCESS_EMAIL', ''),

    /*
    |--------------------------------------------------------------------------
    | Permissions
    |--------------------------------------------------------------------------
    | Permissions excluded from admin role by default.
    | Super admin always receives all permissions regardless of this list.
    */
    'permissions' => [
        'admin_excluded' => ['roles.view', 'roles.edit'],
    ],

    /*
|--------------------------------------------------------------------------
| Locales
|--------------------------------------------------------------------------
| Supported locales for the admin panel interface and post content.
| Add new locales to the available array and create matching lang/ files.
*/
    'locales' => [
        'default'   => env('LARAKIT_DEFAULT_LOCALE', 'en'),
        'available' => ['en', 'ka'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    | Max attempts and decay time (in seconds) for login and API throttling.
    | Override via .env to tune per environment without touching code.
    */
    'rate_limiting' => [
        'login' => [
            'max_attempts' => env('LARAKIT_LOGIN_MAX_ATTEMPTS', 5),
            'decay_seconds' => env('LARAKIT_LOGIN_DECAY_SECONDS', 60),
        ],
        'api' => [
            'max_attempts' => env('LARAKIT_API_MAX_ATTEMPTS', 60),
            'decay_seconds' => env('LARAKIT_API_DECAY_SECONDS', 60),
        ],
    ],
];
