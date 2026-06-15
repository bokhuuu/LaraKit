<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\Settings\SettingType;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

/**
 * Handles HTTP requests for the site settings module.
 *
 * Settings are stored as key-value pairs grouped by tabs.
 * File-based settings (logo, favicon, OG image) are managed
 * separately via Spatie Media Library.
 */
class SettingController extends Controller
{
    /**
     * Renders the settings page with all settings grouped by tab.
     *
     * File-based settings are resolved to their Media Library URLs separately,
     * since their value column doesn't hold the file path directly.
     */
    public function index(): Response
    {
        $settings = Setting::orderBy('group')
            ->orderBy('order')
            ->get()
            ->groupBy('group');

        $fileUrls = Setting::where('type', SettingType::FILE)
            ->get()
            ->mapWithKeys(fn($setting) => [
                $setting->key => $setting->getFirstMediaUrl($setting->key),
            ]);

        return Inertia::render('admin/settings/index', [
            'settings' => $settings,
            'groups' => array_keys($settings->toArray()),
            'fileUrls' => $fileUrls,
        ]);
    }

    /**
     * Persists updated settings and handles file uploads.
     *
     * Processes two payloads in a single request: regular key-value settings
     * and file uploads. Invalidates the settings cache after saving so
     * changes are reflected immediately across the panel.
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'settings' => ['required', 'array'],
            'settings.*' => ['nullable', 'string', 'max:5000'],
            'files' => ['nullable', 'array'],
            'files.*' => ['nullable', 'file', 'image', 'max:2048'],
        ]);

        foreach ($request->settings as $key => $value) {
            $setting = Setting::where('key', $key)->first();

            if ($setting) {
                $setting->update(['value' => $value]);
            }
        }

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $key => $file) {
                $setting = Setting::where('key', $key)->first();

                if ($setting) {
                    $setting->addMedia($file)
                        ->toMediaCollection($key);
                }
            }
        }

        Setting::invalidateCache();

        return redirect()->route('admin.settings.index')
            ->with('success', 'Site settings updated successfully.');
    }
}
