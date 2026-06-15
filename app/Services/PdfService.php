<?php

declare(strict_types=1);

namespace App\Services;

use App\Modules\Posts\Models\Post;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

/**
 * Handles PDF generation for exportable resources.
 */
class PdfService
{
    /**
     * Generate and stream a PDF for a single post.
     */
    public function generatePostPdf(Post $post): Response
    {
        $post->loadMissing(['author', 'category', 'tags']);

        $pdf = Pdf::loadView('pdf.post', ['post' => $post])
            ->setPaper('a4', 'portrait');

        return $pdf->stream($this->postFilename($post));
    }

    /**
     * Generate a clean filename for the post PDF.
     */
    private function postFilename(Post $post): string
    {
        return 'post-'.$post->slug.'.pdf';
    }
}
