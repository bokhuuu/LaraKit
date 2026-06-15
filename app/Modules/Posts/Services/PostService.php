<?php

declare(strict_types=1);

namespace App\Modules\Posts\Services;

use App\Modules\Posts\Enums\PostStatus;
use App\Modules\Posts\Models\Post;
use App\Modules\Posts\Repositories\PostRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

/**
 * Handles business logic for the Posts module.
 *
 * Responsible for slug generation, status-aware publish date resolution,
 * tag syncing, media handling and coordinating repository calls.
 * Controllers stay thin because all decisions are made here.
 */
class PostService
{
    public function __construct(
        private readonly PostRepository $repository,
    ) {}

    /**
     * Returns paginated posts with optional filters for the index view.
     */
    public function getPaginatedPosts(array $filters = []): LengthAwarePaginator
    {
        return $this->repository->paginate($filters);
    }

    /**
     * Returns paginated soft-deleted posts for the trash view.
     */
    public function getTrashedPosts(): LengthAwarePaginator
    {
        return $this->repository->paginateTrashed();
    }

    /**
     * Returns all categories and tags formatted for form dropdowns.
     */
    public function getFormOptions(): array
    {
        return [
            'categories' => $this->repository->allCategories(),
            'tags' => $this->repository->allTags(),
        ];
    }

    /**
     * Creates a new post, generates its slug, sets the author, 
     * syncs tags and handles the featured image.
     */
    public function create(array $data, int $authorId): Post
    {
        $data['slug'] = $this->generateSlug($data['title']);
        $data['author_id'] = $authorId;
        $data['status'] = $data['status'] ?? PostStatus::Draft->value;

        $data['published_at'] = $this->resolvePublishedAt($data);

        $post = $this->repository->create($data);

        $this->syncTags($post, $data['tag_ids'] ?? []);
        $this->handleFeaturedImage($post, $data);

        return $post;
    }

    /**
     * Updates a post, regenerates the slug if the title changed, 
     * syncs tags and handles media.
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
     * Soft deletes the post, leaving it recoverable from trash.
     */
    public function delete(Post $post): void
    {
        $this->repository->delete($post);
    }

    /**
     * Restores a soft-deleted post by ID.
     */
    public function restore(int $id): void
    {
        $this->repository->restore($id);
    }

    /**
     * Clears all media collections before permanently deleting the post.
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
     * Generates a unique slug from a title, 
     * incrementing a suffix if the base slug is already taken.
     */
    private function generateSlug(string $title, ?int $excludeId = null): string
    {
        $slug = Str::slug($title);
        $base = $slug;
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
     * Syncs the post's tags via the pivot table, replacing any previous selection.
     */
    private function syncTags(Post $post, array $tagIds): void
    {
        $post->tags()->sync($tagIds);
    }

    /**
     * Replaces the featured image in Media Library if a new file was uploaded.
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
     * Resolves the published_at timestamp based on the post's target status. 
     * Sets now() when publishing, uses the provided date when scheduling, 
     * clears it when reverting to draft.
     */
    private function resolvePublishedAt(array $data, ?Post $existing = null): ?string
    {
        $status = $data['status'] ?? $existing?->status->value;

        return match ($status) {
            PostStatus::Published->value => $data['published_at'] ?? now()->toDateString(),
            PostStatus::Scheduled->value => $data['published_at'],
            default => null,
        };
    }
}
