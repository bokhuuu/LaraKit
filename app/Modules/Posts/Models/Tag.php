<?php

declare(strict_types=1);

namespace App\Modules\Posts\Models;

use Database\Factories\TagFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Represents a tag that can be attached to many posts.
 */
class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
    ];

    /**
     * A tag belongs to many posts through the post_tag pivot.
     */
    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class);
    }

    protected static function newFactory(): TagFactory
    {
        return TagFactory::new();
    }
}
