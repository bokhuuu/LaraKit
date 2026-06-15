<?php

declare(strict_types=1);

namespace App\Modules\Posts\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Posts\Models\Post;
use App\Modules\Posts\Requests\StorePostRequest;
use App\Modules\Posts\Requests\UpdatePostRequest;
use App\Modules\Posts\Services\PostService;
use App\Services\ExcelService;
use App\Services\PdfService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Handles HTTP requests for the Posts admin module.
 */
class PostController extends Controller
{
    public function __construct(
        private readonly PostService $service,
        private readonly PdfService $pdfService,
        private readonly ExcelService $excelService,
    ) {}

    /**
     * Display paginated list of posts with filters.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'category_id', 'author_id']);

        return Inertia::render('admin/posts/index', [
            'posts' => $this->service->getPaginatedPosts($filters),
            'filters' => $filters,
        ]);
    }

    /**
     * Display the create post form.
     */
    public function create(): Response
    {
        return Inertia::render('admin/posts/create', $this->service->getFormOptions());
    }

    /**
     * Store a newly created post.
     */
    public function store(StorePostRequest $request): RedirectResponse
    {
        $this->service->create($request->validated(), $request->user()->id);

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post created successfully.');
    }

    /**
     * Display the edit post form.
     */
    public function edit(Post $post): Response
    {
        return Inertia::render('admin/posts/edit', [
            'post' => $post->load(['category', 'tags', 'media']),
            ...$this->service->getFormOptions(),
        ]);
    }

    /**
     * Update an existing post.
     */
    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $this->service->update($post, $request->validated());

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post updated successfully.');
    }

    /**
     * Soft delete a post.
     */
    public function destroy(Post $post): RedirectResponse
    {
        $this->service->delete($post);

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post moved to trash.');
    }

    /**
     * Display trashed posts.
     */
    public function trash(Request $request): Response
    {
        return Inertia::render('admin/posts/trash', [
            'posts' => $this->service->getTrashedPosts(),
        ]);
    }

    /**
     * Restore a soft-deleted post.
     */
    public function restore(int $id): RedirectResponse
    {
        $this->service->restore($id);

        return redirect()->route('admin.posts.trash')
            ->with('success', 'Post restored.');
    }

    /**
     * Permanently delete a post.
     */
    public function forceDelete(int $id): RedirectResponse
    {
        $this->service->forceDelete($id);

        return redirect()->route('admin.posts.trash')
            ->with('success', 'Post permanently deleted.');
    }

    /**
     * Stream a PDF export of the post.
     */
    public function exportPdf(Post $post): \Illuminate\Http\Response
    {
        return $this->pdfService->generatePostPdf($post);
    }

    /**
     * Download all posts as an Excel export.
     */
    public function exportExcel(): BinaryFileResponse
    {
        return $this->excelService->exportPosts();
    }
}
