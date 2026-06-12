<?php

declare(strict_types=1);

namespace App\Modules\Posts\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Transforms a Post model into a clean JSON structure for API responses.
 */
class PostResource extends JsonResource
{
    /**
     * Transform the post into an array for API output.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'title'            => $this->title,
            'slug'             => $this->slug,
            'excerpt'          => $this->excerpt,
            'body'             => $this->body,
            'status'           => $this->status->value,
            'status_label'     => $this->status->label(),
            'published_at'     => $this->published_at?->toDateString(),
            'created_at'       => $this->created_at->toDateTimeString(),
            'updated_at'       => $this->updated_at->toDateTimeString(),

            'author' => [
                'id'   => $this->author->id,
                'name' => $this->author->name,
            ],

            'category' => $this->category ? [
                'id'   => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ] : null,

            'tags' => $this->tags->map(fn($tag) => [
                'id'   => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
            ]),

            'featured_image' => $this->getFirstMediaUrl('featured_image') ?: null,

            'seo' => [
                'meta_title'       => $this->meta_title,
                'meta_description' => $this->meta_description,
            ],
        ];
    }
}
