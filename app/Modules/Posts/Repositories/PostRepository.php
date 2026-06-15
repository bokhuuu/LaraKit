<?php

declare(strict_types=1);

namespace App\Modules\Posts\Repositories;

use App\Modules\Posts\Models\Category;
use App\Modules\Posts\Models\Post;
use App\Modules\Posts\Models\Tag;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Handles all database queries for the Posts module.
 *
 * The only place in the module that directly queries Post, Category and Tag.
 * Business logic and permission checks live in PostService, not here.
 */
class PostRepository
{
    /**
     * Returns paginated posts with optional search, status, category and author filters.
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
     * Returns paginated soft-deleted posts ordered by deletion date.
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
     * Finds a post by ID including soft-deleted records, or returns null.
     */
    public function findById(int $id): ?Post
    {
        return Post::withTrashed()->with(['author', 'category', 'tags', 'media'])->find($id);
    }

    /**
     * Finds a published post by slug for API or public access, or returns null.
     */
    public function findBySlug(string $slug): ?Post
    {
        return Post::with(['author', 'category', 'tags', 'media'])
            ->where('slug', $slug)
            ->first();
    }

    /**
     * Creates and returns a new post record.
     */
    public function create(array $data): Post
    {
        return Post::create($data);
    }

    /**
     * Updates the post and returns a fresh instance with the latest data.
     */
    public function update(Post $post, array $data): Post
    {
        $post->update($data);

        return $post->fresh();
    }

    /**
     * Soft deletes the post, making it recoverable from trash.
     */
    public function delete(Post $post): void
    {
        $post->delete();
    }

    /**
     * Restores a soft-deleted post by ID.
     */
    public function restore(int $id): void
    {
        Post::withTrashed()->findOrFail($id)->restore();
    }

    /**
     * Permanently deletes a post by ID, bypassing soft delete.
     */
    public function forceDelete(int $id): void
    {
        Post::withTrashed()->findOrFail($id)->forceDelete();
    }

    /**
     * Returns all categories ordered alphabetically for use in dropdowns.
     */
    public function allCategories(): Collection
    {
        return Category::orderBy('name')->get();
    }

    /**
     * Returns all tags ordered alphabetically for use in the tag picker.
     */
    public function allTags(): Collection
    {
        return Tag::orderBy('name')->get();
    }
}
