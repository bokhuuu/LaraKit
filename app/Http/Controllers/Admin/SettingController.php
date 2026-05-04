<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Settings\SettingType;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::orderBy('group')
            ->orderBy('order')
            ->get()
            ->groupBy('group');

        $fileUrls = Setting::where('type', SettingType::FILE)
            ->get()
            ->mapWithKeys(fn($setting) => [
                $setting->key => $setting->getFirstMediaUrl($setting->key)
            ]);

        return Inertia::render('admin/settings/index', [
            'settings' => $settings,
            'groups'   => array_keys($settings->toArray()),
            'fileUrls' => $fileUrls,
        ]);
    }

    public function update(Request $request)
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
