<?php

declare(strict_types=1);

namespace App\Modules\Posts\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Represents a post category for grouping related content.
 */
class Category extends Model
{
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
}
