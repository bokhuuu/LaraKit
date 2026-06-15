<?php

declare(strict_types=1);

namespace App\Modules\Posts\Models;

use App\Models\User;
use App\Modules\Posts\Enums\PostStatus;
use Database\Factories\PostFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Represents a blog post within the Posts module.
 *
 * Supports rich content via TipTap, featured images via Media Library,
 * status management, SEO fields, soft deletes and full activity logging.
 */
class Post extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use LogsActivity;
    use SoftDeletes;

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
            'status' => PostStatus::class,
            'published_at' => 'datetime',
        ];
    }

    /**
     * Registers featured image and OG image as single-file media collections. 
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
     * Generates a thumbnail conversion for the featured image at config-driven dimensions. 
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(config('larakit.posts.thumb_width', 800))
            ->height(config('larakit.posts.thumb_height', 450))
            ->performOnCollections('featured_image');
    }

    /**
     *  Logs all fillable field changes, only when values actually differ. 
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
     * Filters to posts with a published status. 
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', PostStatus::Published);
    }

    /** 
     * Filters to posts with a draft status. 
     */
    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', PostStatus::Draft);
    }

    /** 
     * Filters to posts with a scheduled status. 
     */
    public function scopeScheduled(Builder $query): Builder
    {
        return $query->where('status', PostStatus::Scheduled);
    }

    /** 
     * Filters to posts belonging to the given author. 
     */
    public function scopeByAuthor(Builder $query, int $authorId): Builder
    {
        return $query->where('author_id', $authorId);
    }

    protected static function newFactory(): PostFactory
    {
        return PostFactory::new();
    }
}
