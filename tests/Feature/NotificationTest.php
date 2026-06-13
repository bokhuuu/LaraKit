<?php

declare(strict_types=1);

use App\Mail\WelcomeEmail;
use App\Models\User;
use App\Notifications\NewUserRegistered;
use Database\Seeders\Auth\PermissionSeeder;
use Database\Seeders\Auth\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->seed(PermissionSeeder::class);
});

it('welcome email is sent when a new user is created', function () {
    Mail::fake();

    $admin = User::factory()->withRole('admin')->create();

    $this->actingAs($admin)->post(route('admin.users.store'), [
        'name'                  => 'New User',
        'email'                 => 'newuser@example.com',
        'password'              => 'password',
        'password_confirmation' => 'password',
        'role'                  => 'viewer',
        'is_active'             => true,
    ]);

    Mail::assertSent(WelcomeEmail::class, function ($mail) {
        return $mail->hasTo('newuser@example.com');
    });
});

it('admins are notified when a new user is created', function () {
    Notification::fake();

    $admin = User::factory()->withRole('admin')->create();

    $this->actingAs($admin)->post(route('admin.users.store'), [
        'name'                  => 'New User',
        'email'                 => 'newuser@example.com',
        'password'              => 'password',
        'password_confirmation' => 'password',
        'role'                  => 'viewer',
        'is_active'             => true,
    ]);

    Notification::assertSentTo($admin, NewUserRegistered::class);
});
