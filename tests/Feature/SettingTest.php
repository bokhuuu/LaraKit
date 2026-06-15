<?php

declare(strict_types=1);

use App\Models\Setting;
use App\Models\User;
use Database\Seeders\Auth\PermissionSeeder;
use Database\Seeders\Auth\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->seed(PermissionSeeder::class);
});

it('admin can view settings page', function () {
    $admin = User::factory()->withRole('admin')->create();

    $response = $this->actingAs($admin)->get(route('admin.settings.index'));

    $response->assertStatus(200);
});

it('admin can update a setting value', function () {
    $admin = User::factory()->withRole('admin')->create();

    Setting::create([
        'key' => 'site_name',
        'value' => 'Old Name',
        'type' => 'text',
        'group' => 'general',
        'order' => 1,
        'label' => 'Site Name',
    ]);

    $this->actingAs($admin)->put(route('admin.settings.update'), [
        'settings' => ['site_name' => 'New Name'],
    ]);

    $this->assertDatabaseHas('settings', [
        'key' => 'site_name',
        'value' => 'New Name',
    ]);
});

it('redirects to settings index after update', function () {
    $admin = User::factory()->withRole('admin')->create();

    $response = $this->actingAs($admin)->put(route('admin.settings.update'), [
        'settings' => ['site_name' => 'Test'],
    ]);

    $response->assertRedirect(route('admin.settings.index'));
});

it('cache is invalidated after settings update', function () {
    $admin = User::factory()->withRole('admin')->create();

    cache()->put(config('larakit.cache.keys.site_settings'), 'cached', 60);

    $this->actingAs($admin)->put(route('admin.settings.update'), [
        'settings' => ['site_name' => 'Test'],
    ]);

    expect(cache()->has(config('larakit.cache.keys.site_settings')))->toBeFalse();
});
