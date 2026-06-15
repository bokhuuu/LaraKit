<?php

declare(strict_types=1);

namespace App\Exports;

use App\Modules\Posts\Models\Post;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * Exports posts to an Excel spreadsheet with headings and formatted rows.
 */
class PostsExport implements FromQuery, WithHeadings, WithMapping, WithStyles
{
    /**
     * Base query for posts with eager loaded relationships.
     */
    public function query()
    {
        return Post::query()
            ->with(['author', 'category', 'tags'])
            ->orderBy('created_at', 'desc');
    }

    /**
     * Column headings for the spreadsheet.
     */
    public function headings(): array
    {
        return [
            'ID',
            'Title',
            'Status',
            'Author',
            'Category',
            'Tags',
            'Published At',
            'Created At',
        ];
    }

    /**
     * Map each post row to spreadsheet columns.
     */
    public function map($post): array
    {
        return [
            $post->id,
            $post->title,
            $post->status->label(),
            $post->author->name,
            $post->category?->name ?? '-',
            $post->tags->pluck('name')->join(', '),
            $post->published_at?->format('Y-m-d') ?? '-',
            $post->created_at->format('Y-m-d'),
        ];
    }

    /**
     * Style the heading row - bold and background color.
     */
    public function styles(Worksheet $sheet): array
    {
        return [
            1 => [
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => 'solid',
                    'startColor' => ['rgb' => 'F3F4F6'],
                ],
            ],
        ];
    }
}
