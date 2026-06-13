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

it('admin can create a user', function () {
    $admin = User::factory()->withRole('admin')->create();

    $response = $this->actingAs($admin)->post(route('admin.users.store'), [
        'name'                  => 'Test User',
        'email'                 => 'test@example.com',
        'password'              => 'password',
        'password_confirmation' => 'password',
        'role'                  => 'viewer',
        'is_active'             => true,
    ]);

    $response->assertRedirect(route('admin.users.index'));
    $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
});

it('admin can update a user', function () {
    $admin = User::factory()->withRole('admin')->create();
    $user  = User::factory()->withRole('viewer')->create();

    $response = $this->actingAs($admin)->put(route('admin.users.update', $user), [
        'name'     => 'Updated Name',
        'email'    => $user->email,
        'role'     => 'viewer',
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.users.index'));
    $this->assertDatabaseHas('users', ['name' => 'Updated Name']);
});

it('admin can soft delete a user', function () {
    $admin = User::factory()->withRole('admin')->create();
    $user  = User::factory()->withRole('viewer')->create();

    $response = $this->actingAs($admin)->delete(route('admin.users.delete', $user));;

    $response->assertRedirect(route('admin.users.index'));
    $this->assertSoftDeleted('users', ['id' => $user->id]);
});

it('admin can restore a trashed user', function () {
    $admin = User::factory()->withRole('admin')->create();
    $user  = User::factory()->withRole('viewer')->create();
    $user->delete();

    $response = $this->actingAs($admin)->patch(route('admin.users.restore', $user->id));;

    $response->assertRedirect(route('admin.users.index'));
    $this->assertNotSoftDeleted('users', ['id' => $user->id]);
});

it('admin can force delete a user', function () {
    $admin = User::factory()->withRole('admin')->create();
    $user  = User::factory()->withRole('viewer')->create();
    $user->delete();

    $response = $this->actingAs($admin)->delete(route('admin.users.force-delete', $user->id));

    $response->assertRedirect(route('admin.users.index'));
    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});

it('admin cannot delete himself', function () {
    $admin = User::factory()->withRole('admin')->create();

    $response = $this->actingAs($admin)->delete(route('admin.users.delete', $admin));

    $response->assertRedirect();
    $response->assertSessionHas('error');
});

it('admin cannot modify another admin', function () {
    $admin      = User::factory()->withRole('admin')->create();
    $otherAdmin = User::factory()->withRole('admin')->create();

    $response = $this->actingAs($admin)->put(route('admin.users.update', $otherAdmin), [
        'name'      => 'Hacked',
        'email'     => $otherAdmin->email,
        'role'      => 'admin',
        'is_active' => true,
    ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors('general');
});

it('admin cannot deactivate their own account', function () {
    $admin = User::factory()->withRole('admin')->create();

    $response = $this->actingAs($admin)->put(route('admin.users.update', $admin), [
        'name'      => $admin->name,
        'email'     => $admin->email,
        'role'      => 'admin',
        'is_active' => false,
    ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors('general');
});

it('admin cannot create another admin account', function () {
    $admin = User::factory()->withRole('admin')->create();

    $response = $this->actingAs($admin)->post(route('admin.users.store'), [
        'name'                  => 'New Admin',
        'email'                 => 'newadmin@example.com',
        'password'              => 'password',
        'password_confirmation' => 'password',
        'role'                  => 'admin',
        'is_active'             => true,
    ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors('general');
});
