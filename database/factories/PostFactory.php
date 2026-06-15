<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\User;
use App\Modules\Posts\Enums\PostStatus;
use App\Modules\Posts\Models\Category;
use App\Modules\Posts\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        $title = fake()->sentence();

        return [
            'title' => $title,
            'slug' => str($title)->slug(),
            'body' => fake()->paragraphs(3, true),
            'excerpt' => fake()->sentence(),
            'status' => PostStatus::Draft,
            'meta_title' => fake()->sentence(),
            'meta_description' => fake()->sentence(),
            'published_at' => null,
            'category_id' => Category::factory(),
            'author_id' => User::factory(),
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PostStatus::Published,
            'published_at' => now(),
        ]);
    }
}
