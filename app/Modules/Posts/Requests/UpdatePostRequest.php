<?php

declare(strict_types=1);

namespace App\Modules\Posts\Requests;

use App\Modules\Posts\Enums\PostStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

/**
 * Validates incoming data for updating an existing post.
 */
class UpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'            => ['required', 'string', 'max:255'],
            'body'             => ['nullable', 'string'],
            'excerpt'          => ['nullable', 'string', 'max:500'],
            'status'           => ['required', new Enum(PostStatus::class)],
            'category_id'      => ['nullable', 'exists:categories,id'],
            'tag_ids'          => ['nullable', 'array'],
            'tag_ids.*'        => ['exists:tags,id'],
            'featured_image'   => ['nullable', 'image', 'max:2048'],
            'meta_title'       => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:160'],
            'published_at'     => ['nullable', 'date'],
        ];
    }
}
