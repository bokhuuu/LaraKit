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
 * Defines the Excel export for the posts index.
 *
 * Implements FromQuery so Laravel Excel streams the data directly
 * from the database without loading all posts into memory at once.
 */
class PostsExport implements FromQuery, WithHeadings, WithMapping, WithStyles
{
    /**
     * Provides the base query for the export, ordered newest first.
     */
    public function query(): \Illuminate\Database\Eloquent\Builder
    {
        return Post::query()
            ->with(['author', 'category', 'tags'])
            ->orderBy('created_at', 'desc');
    }

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
     * Maps a single post to an array of spreadsheet column values.
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
     * Applies bold font and a light gray background to the heading row.
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
