<?php

declare(strict_types=1);

namespace App\Modules\Posts\Models;

use Database\Factories\CategoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Represents a post category for grouping related content.
 */
class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
    ];

    /**
     * A category has many posts.
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    protected static function newFactory(): CategoryFactory
    {
        return CategoryFactory::new();
    }
}
