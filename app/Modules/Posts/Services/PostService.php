<?php

declare(strict_types=1);

namespace App\Modules\Posts\Services;

use App\Modules\Posts\Enums\PostStatus;
use App\Modules\Posts\Models\Post;
use App\Modules\Posts\Repositories\PostRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

/**
 * Handles business logic for creating, updating and managing posts.
 */
class PostService
{
    public function __construct(
        private readonly PostRepository $repository,
    ) {}

    /**
     * Return paginated posts with filters for the index view.
     */
    public function getPaginatedPosts(array $filters = []): LengthAwarePaginator
    {
        return $this->repository->paginate($filters);
    }

    /**
     * Return paginated trashed posts for the trash view.
     */
    public function getTrashedPosts(): LengthAwarePaginator
    {
        return $this->repository->paginateTrashed();
    }

    /**
     * Return all categories and tags for form dropdowns.
     */
    public function getFormOptions(): array
    {
        return [
            'categories' => $this->repository->allCategories(),
            'tags'       => $this->repository->allTags(),
        ];
    }

    /**
     * Create a new post, generate slug, handle media and tags.
     */
    public function create(array $data, int $authorId): Post
    {
        $data['slug']      = $this->generateSlug($data['title']);
        $data['author_id'] = $authorId;
        $data['status']    = $data['status'] ?? PostStatus::Draft->value;

        $data['published_at'] = $this->resolvePublishedAt($data);

        $post = $this->repository->create($data);

        $this->syncTags($post, $data['tag_ids'] ?? []);
        $this->handleFeaturedImage($post, $data);

        return $post;
    }

    /**
     * Update an existing post, regenerate slug if title changed, sync tags.
     */
    public function update(Post $post, array $data): Post
    {
        if (isset($data['title']) && $data['title'] !== $post->title) {
            $data['slug'] = $this->generateSlug($data['title'], $post->id);
        }

        $data['published_at'] = $this->resolvePublishedAt($data, $post);

        $post = $this->repository->update($post, $data);

        $this->syncTags($post, $data['tag_ids'] ?? []);
        $this->handleFeaturedImage($post, $data);

        return $post;
    }

    /**
     * Soft delete a post.
     */
    public function delete(Post $post): void
    {
        $this->repository->delete($post);
    }

    /**
     * Restore a soft-deleted post.
     */
    public function restore(int $id): void
    {
        $this->repository->restore($id);
    }

    /**
     * Permanently delete a post and its media.
     */
    public function forceDelete(int $id): void
    {
        $post = $this->repository->findById($id);

        if ($post) {
            $post->clearMediaCollection('featured_image');
            $post->clearMediaCollection('og_image');
        }

        $this->repository->forceDelete($id);
    }

    /**
     * Generate a unique slug from a title, excluding current post on update.
     */
    private function generateSlug(string $title, ?int $excludeId = null): string
    {
        $slug  = Str::slug($title);
        $base  = $slug;
        $count = 1;

        while (
            Post::where('slug', $slug)
            ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
            ->exists()
        ) {
            $slug = "{$base}-{$count}";
            $count++;
        }

        return $slug;
    }

    /**
     * Sync tags on the post pivot table.
     */
    private function syncTags(Post $post, array $tagIds): void
    {
        $post->tags()->sync($tagIds);
    }

    /**
     * Handle featured image upload via Spatie Media Library.
     */
    private function handleFeaturedImage(Post $post, array $data): void
    {
        if (isset($data['featured_image'])) {
            $post->clearMediaCollection('featured_image');
            $post->addMedia($data['featured_image'])
                ->toMediaCollection('featured_image', config('larakit.media.disk'));
        }
    }

    /**
     * Resolve published_at based on status - sets timestamp when publishing,
     * clears it when moving back to draft.
     */
    private function resolvePublishedAt(array $data, ?Post $existing = null): ?string
    {
        $status = $data['status'] ?? $existing?->status->value;

        return match ($status) {
            PostStatus::Published->value => $data['published_at'] ?? now()->toDateString(),
            PostStatus::Scheduled->value => $data['published_at'],
            default                      => null,
        };
    }
}
