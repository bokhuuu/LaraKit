<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

/**
 * Injects shared data into every Inertia response.
 *
 * This middleware runs on every request and is the single source of truth
 * for data available globally on the frontend: authenticated user, flash messages,
 * site settings, notifications and the asset version key used for cache busting.
 */
class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * Returns a cache-stored integer that is incremented by ClearsInertiaCache
     * whenever a model is mutated, forcing Inertia to reload shared data.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        if (! cache()->has('inertia_version')) {
            cache()->forever('inertia_version', 1);
        }

        return (string) cache()->get('inertia_version', 1);
    }

    /**
     * Define the props that are shared by default.
     *
     * Shared on every request: auth user with roles, flash messages with a timestamp
     * to force re-triggering, site name and logo from cache and up to 10 unread
     * notifications for the bell icon.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => cache()->remember(
                config('larakit.cache.keys.site_name'),
                config('larakit.cache.site_settings_ttl'),
                fn() => Setting::where('key', 'site_name')->value('value') ?? config('app.name')
            ),
            'auth' => [
                'user' => $request->user()?->load('roles'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'timestamp' => now()->timestamp,
            ],
            'siteSettings' => cache()->remember(
                config('larakit.cache.keys.site_settings'),
                config('larakit.cache.site_settings_ttl'),
                fn() => [
                    'logo' => Setting::where('key', 'site_logo')->first()?->getFirstMediaUrl(config('larakit.media.logo_collection')),
                    'favicon' => Setting::where('key', 'site_favicon')->first()?->getFirstMediaUrl(config('larakit.media.favicon_collection')),
                ]
            ),
            'notifications' => function () use ($request) {
                if (! $request->user()) {
                    return [];
                }

                return $request->user()
                    ->unreadNotifications()
                    ->latest()
                    ->take(config('larakit.notifications.unread_limit'))
                    ->get()
                    ->map(fn($n) => [
                        'id' => $n->id,
                        'message' => $n->data['message'],
                        'user_id' => $n->data['user_id'],
                        'event' => $n->data['event'],
                        'created_at' => $n->created_at->diffForHumans(),
                    ]);
            },
            'locale'       => app()->getLocale(),
            'translations' => fn() => [
                'posts' => trans('posts'),
            ],
        ];
    }
}
