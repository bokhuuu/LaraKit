<?php

declare(strict_types=1);

namespace App\Services;

use App\Exports\PostsExport;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Generates Excel exports using Laravel Excel.
 *
 * Triggers a file download directly from the browser -
 * no file is stored on the server after the response is sent.
 */
class ExcelService
{
    /**
     * Downloads all posts as a date-stamped .xlsx file.
     *
     * The filename includes today's date so each export is uniquely named
     * and exports from different days don't overwrite each other.
     */
    public function exportPosts(): BinaryFileResponse
    {
        return Excel::download(
            new PostsExport,
            'posts-' . now()->format('Y-m-d') . '.xlsx',
        );
    }
}
