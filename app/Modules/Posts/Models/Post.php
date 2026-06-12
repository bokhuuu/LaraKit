<?php

declare(strict_types=1);

namespace App\Modules\Posts\Models;

use App\Models\User;
use App\Modules\Posts\Enums\PostStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Represents a blog post with full content, SEO, status and media support.
 */
class Post extends Model implements HasMedia
{
    use SoftDeletes;
    use LogsActivity;
    use InteractsWithMedia;

    protected $fillable = [
        'title',
        'slug',
        'body',
        'excerpt',
        'status',
        'meta_title',
        'meta_description',
        'published_at',
        'category_id',
        'author_id',
    ];

    protected function casts(): array
    {
        return [
            'status'       => PostStatus::class,
            'published_at' => 'datetime',
        ];
    }

    /**
     * Register media collections for featured image and OG image.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('featured_image')
            ->singleFile()
            ->useDisk(config('larakit.media.disk'));

        $this->addMediaCollection('og_image')
            ->singleFile()
            ->useDisk(config('larakit.media.disk'));
    }

    /**
     * Register media conversions - thumbnail for featured image.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(config('larakit.posts.thumb_width', 800))
            ->height(config('larakit.posts.thumb_height', 450))
            ->performOnCollections('featured_image');
    }

    /**
     * Configure activity logging options for posts.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    /**
     * A post belongs to one category.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * A post belongs to many tags through the post_tag pivot.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    /**
     * A post belongs to one author (User).
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Scope to only published posts.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', PostStatus::Published);
    }

    /**
     * Scope to only draft posts.
     */
    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', PostStatus::Draft);
    }

    /**
     * Scope to only scheduled posts.
     */
    public function scopeScheduled(Builder $query): Builder
    {
        return $query->where('status', PostStatus::Scheduled);
    }

    /**
     * Scope to posts belonging to a specific author.
     */
    public function scopeByAuthor(Builder $query, int $authorId): Builder
    {
        return $query->where('author_id', $authorId);
    }
}
