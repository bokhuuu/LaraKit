<?php

declare(strict_types=1);

namespace App\Modules\Posts\Api;

use App\Http\Controllers\Controller;
use App\Modules\Posts\Models\Post;
use App\Modules\Posts\Resources\PostResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Handles API requests for the Posts resource.
 */
class PostApiController extends Controller
{
    /**
     * Return a paginated list of published posts.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $posts = Post::query()
            ->with(['author', 'category', 'tags', 'media'])
            ->published()
            ->when($request->search, fn($q) => $q->where('title', 'like', "%{$request->search}%"))
            ->when($request->category, fn($q) => $q->whereHas('category', fn($q) => $q->where('slug', $request->category)))
            ->latest('published_at')
            ->paginate(config('larakit.posts.per_page', 10));

        return PostResource::collection($posts);
    }

    /**
     * Return a single published post by slug.
     */
    public function show(string $slug): PostResource
    {
        $post = Post::with(['author', 'category', 'tags', 'media'])
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        return new PostResource($post);
    }
}
