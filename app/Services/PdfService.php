<?php

declare(strict_types=1);

namespace App\Services;

use App\Modules\Posts\Models\Post;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

/**
 * Generates and streams PDF exports using DomPDF.
 *
 * Streams the output directly to the browser so no file is
 * written to disk - the PDF is generated and served in one step.
 */
class PdfService
{
    /**
     * Streams a styled A4 PDF for the given post directly to the browser.
     *
     * Eagerly loads author, category and tags if not already loaded
     * so the PDF view has all the data it needs without extra queries.
     */
    public function generatePostPdf(Post $post): Response
    {
        $post->loadMissing(['author', 'category', 'tags']);

        $pdf = Pdf::loadView('pdf.post', ['post' => $post])
            ->setPaper('a4', 'portrait');

        return $pdf->stream($this->postFilename($post));
    }

    /**
     * Builds a consistent filename using the post slug.
     */
    private function postFilename(Post $post): string
    {
        return 'post-'.$post->slug.'.pdf';
    }
}
