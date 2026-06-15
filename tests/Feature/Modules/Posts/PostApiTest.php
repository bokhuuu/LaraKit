<?php

declare(strict_types=1);

use App\Models\User;
use App\Modules\Posts\Models\Post;
use Database\Seeders\Auth\PermissionSeeder;
use Database\Seeders\Auth\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->seed(PermissionSeeder::class);
});

it('unauthenticated request to api is rejected', function () {
    $response = $this->getJson('/api/v1/posts');

    $response->assertStatus(401);
});

it('authenticated request returns posts', function () {
    $user = User::factory()->withRole('viewer')->create();
    $token = $user->createToken('test-token')->plainTextToken;

    Post::factory()->published()->count(3)->create(['author_id' => $user->id]);

    $response = $this->withToken($token)->getJson('/api/v1/posts');

    $response->assertStatus(200);
    $response->assertJsonCount(3, 'data');
});

it('can fetch a single post by slug', function () {
    $user = User::factory()->withRole('viewer')->create();
    $token = $user->createToken('test-token')->plainTextToken;

    $post = Post::factory()->published()->create(['author_id' => $user->id]);

    $response = $this->withToken($token)->getJson("/api/v1/posts/{$post->slug}");

    $response->assertStatus(200);
    $response->assertJsonFragment(['slug' => $post->slug]);
});

it('health check endpoint returns ok', function () {
    $response = $this->getJson('/api/v1/health');

    $response->assertStatus(200);
});
