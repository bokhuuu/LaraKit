<?php

declare(strict_types=1);

use App\Models\User;
use Database\Seeders\Auth\PermissionSeeder;
use Database\Seeders\Auth\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->seed(PermissionSeeder::class);
});

it('guests cannot access admin routes', function () {
    $response = $this->get(route('admin.dashboard'));

    $response->assertRedirect(route('login'));
});

it('non admin user cannot access admin routes', function () {
    $user = User::factory()->withRole('viewer')->create();

    $response = $this->actingAs($user)->get(route('admin.dashboard'));

    $response->assertStatus(403);
});
