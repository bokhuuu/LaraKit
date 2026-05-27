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
        'footer'           => env('LARAKIT_NOTIFICATION_FOOTER', 'This is an automated notification from LaraKit.'),
        'unread_limit'     => env('LARAKIT_UNREAD_NOTIFICATIONS_LIMIT', 10),
    ],

];
