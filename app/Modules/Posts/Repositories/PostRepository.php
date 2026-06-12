<?php

declare(strict_types=1);

namespace App\Modules\Posts\Repositories;

use App\Modules\Posts\Enums\PostStatus;
use App\Modules\Posts\Models\Category;
use App\Modules\Posts\Models\Post;
use App\Modules\Posts\Models\Tag;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Handles all database queries for the Post model.
 */
class PostRepository
{
    /**
     * Return paginated posts with filters applied, eager loading relationships.
     */
    public function paginate(array $filters = []): LengthAwarePaginator
    {
        return Post::query()
            ->with(['author', 'category', 'tags', 'media'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('excerpt', 'like', "%{$search}%");
                });
            })
            ->when($filters['status'] ?? null, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($filters['category_id'] ?? null, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($filters['author_id'] ?? null, function ($query, $authorId) {
                $query->where('author_id', $authorId);
            })
            ->latest('published_at')
            ->paginate(config('larakit.posts.per_page', 10))
            ->withQueryString();
    }

    /**
     * Return paginated soft-deleted posts for the trash view.
     */
    public function paginateTrashed(): LengthAwarePaginator
    {
        return Post::onlyTrashed()
            ->with(['author', 'category'])
            ->latest('deleted_at')
            ->paginate(config('larakit.posts.per_page', 10))
            ->withQueryString();
    }

    /**
     * Find a post by ID, including soft-deleted records.
     */
    public function findById(int $id): ?Post
    {
        return Post::withTrashed()->with(['author', 'category', 'tags', 'media'])->find($id);
    }

    /**
     * Find a post by slug for public-facing or API access.
     */
    public function findBySlug(string $slug): ?Post
    {
        return Post::with(['author', 'category', 'tags', 'media'])
            ->where('slug', $slug)
            ->first();
    }

    /**
     * Create a new post record.
     */
    public function create(array $data): Post
    {
        return Post::create($data);
    }

    /**
     * Update an existing post record.
     */
    public function update(Post $post, array $data): Post
    {
        $post->update($data);

        return $post->fresh();
    }

    /**
     * Soft delete a post.
     */
    public function delete(Post $post): void
    {
        $post->delete();
    }

    /**
     * Restore a soft-deleted post.
     */
    public function restore(int $id): void
    {
        Post::withTrashed()->findOrFail($id)->restore();
    }

    /**
     * Permanently delete a post.
     */
    public function forceDelete(int $id): void
    {
        Post::withTrashed()->findOrFail($id)->forceDelete();
    }

    /**
     * Return all categories for dropdowns.
     */
    public function allCategories(): Collection
    {
        return Category::orderBy('name')->get();
    }

    /**
     * Return all tags for the tag picker.
     */
    public function allTags(): Collection
    {
        return Tag::orderBy('name')->get();
    }
}
