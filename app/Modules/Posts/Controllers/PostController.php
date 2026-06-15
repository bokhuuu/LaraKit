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
 *
 * Delegates all business logic to PostService, PdfService and ExcelService.
 * Responsible only for receiving requests and returning Inertia responses or redirects.
 */
class PostController extends Controller
{
    public function __construct(
        private readonly PostService $service,
        private readonly PdfService $pdfService,
        private readonly ExcelService $excelService,
    ) {}

    /**
     * Renders the posts index with pagination and active filters.
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
     * Renders the create post form with categories and tags.
     */
    public function create(): Response
    {
        return Inertia::render('admin/posts/create', $this->service->getFormOptions());
    }

    /**
     * Validates, creates a new post and redirects to the index.
     */
    public function store(StorePostRequest $request): RedirectResponse
    {
        $this->service->create($request->validated(), $request->user()->id);

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post created successfully.');
    }

    /**
     * Renders the edit form with the post's current data, categories and tags.
     */
    public function edit(Post $post): Response
    {
        return Inertia::render('admin/posts/edit', [
            'post' => $post->load(['category', 'tags', 'media']),
            ...$this->service->getFormOptions(),
        ]);
    }

    /**
     * Validates and applies updates to an existing post.
     */
    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $this->service->update($post, $request->validated());

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post updated successfully.');
    }

    /**
     * Soft deletes the post and redirects to the index.
     */
    public function destroy(Post $post): RedirectResponse
    {
        $this->service->delete($post);

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post moved to trash.');
    }

    /**
     * Renders the trash view with soft-deleted posts.
     */
    public function trash(Request $request): Response
    {
        return Inertia::render('admin/posts/trash', [
            'posts' => $this->service->getTrashedPosts(),
        ]);
    }

    /**
     * Restores a soft-deleted post and redirects to trash.
     */
    public function restore(int $id): RedirectResponse
    {
        $this->service->restore($id);

        return redirect()->route('admin.posts.trash')
            ->with('success', 'Post restored.');
    }

    /**
     * Permanently deletes a post and its media, then redirects to trash.
     */
    public function forceDelete(int $id): RedirectResponse
    {
        $this->service->forceDelete($id);

        return redirect()->route('admin.posts.trash')
            ->with('success', 'Post permanently deleted.');
    }

    /**
     * Streams a styled PDF of the post directly to the browser.
     */
    public function exportPdf(Post $post): \Illuminate\Http\Response
    {
        return $this->pdfService->generatePostPdf($post);
    }

    /**
     * Downloads all posts as a date-stamped Excel file.
     */
    public function exportExcel(): BinaryFileResponse
    {
        return $this->excelService->exportPosts();
    }
}
