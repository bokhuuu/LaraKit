<?php

declare(strict_types=1);

namespace App\Services;

use App\Exports\PostsExport;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Handles Excel export generation for downloadable spreadsheets.
 */
class ExcelService
{
    /**
     * Download all posts as an Excel file.
     */
    public function exportPosts(): BinaryFileResponse
    {
        return Excel::download(
            new PostsExport,
            'posts-'.now()->format('Y-m-d').'.xlsx',
        );
    }
}
