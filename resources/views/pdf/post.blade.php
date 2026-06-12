<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ $post->title }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 13px;
            color: #1a1a1a;
            line-height: 1.6;
            padding: 40px;
        }

        .header {
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
            margin-bottom: 24px;
        }

        .title {
            font-size: 26px;
            font-weight: bold;
            color: #111827;
            margin-bottom: 10px;
        }

        .meta {
            font-size: 12px;
            color: #6b7280;
            display: flex;
            gap: 16px;
        }

        .meta span {
            margin-right: 16px;
        }

        .badge {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .badge-draft {
            background: #f3f4f6;
            color: #374151;
        }

        .badge-published {
            background: #d1fae5;
            color: #065f46;
        }

        .badge-scheduled {
            background: #fef3c7;
            color: #92400e;
        }

        .excerpt {
            background: #f9fafb;
            border-left: 4px solid #d1d5db;
            padding: 12px 16px;
            margin-bottom: 24px;
            font-style: italic;
            color: #4b5563;
            font-size: 13px;
        }

        .content {
            margin-bottom: 32px;
        }

        .content h2 {
            font-size: 18px;
            font-weight: bold;
            margin: 20px 0 8px;
            color: #111827;
        }

        .content h3 {
            font-size: 15px;
            font-weight: bold;
            margin: 16px 0 6px;
            color: #374151;
        }

        .content p {
            margin-bottom: 10px;
        }

        .content ul,
        .content ol {
            padding-left: 20px;
            margin-bottom: 10px;
        }

        .content li {
            margin-bottom: 4px;
        }

        .content a {
            color: #2563eb;
        }

        .footer {
            border-top: 1px solid #e5e7eb;
            padding-top: 16px;
            margin-top: 32px;
            font-size: 11px;
            color: #9ca3af;
            display: flex;
            justify-content: space-between;
        }

        .tags {
            margin-top: 24px;
        }

        .tags-label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #6b7280;
            margin-bottom: 6px;
        }

        .tag {
            display: inline-block;
            background: #f3f4f6;
            color: #374151;
            padding: 2px 10px;
            border-radius: 9999px;
            font-size: 11px;
            margin-right: 4px;
            margin-bottom: 4px;
        }
    </style>
</head>

<body>

    <div class="header">
        <div class="title">{{ $post->title }}</div>
        <div class="meta">
            <span>By {{ $post->author->name }}</span>
            @if ($post->category)
                <span>{{ $post->category->name }}</span>
            @endif
            @if ($post->published_at)
                <span>{{ \Carbon\Carbon::parse($post->published_at)->format('M d, Y') }}</span>
            @endif
            <span>
                <span class="badge badge-{{ $post->status->value }}">
                    {{ $post->status->label() }}
                </span>
            </span>
        </div>
    </div>

    @if ($post->excerpt)
        <div class="excerpt">{{ $post->excerpt }}</div>
    @endif

    <div class="content">
        {!! $post->body !!}
    </div>

    @if ($post->tags->count() > 0)
        <div class="tags">
            <div class="tags-label">Tags</div>
            @foreach ($post->tags as $tag)
                <span class="tag">{{ $tag->name }}</span>
            @endforeach
        </div>
    @endif

    <div class="footer">
        <span>{{ config('app.name') }}</span>
        <span>Generated {{ now()->format('M d, Y') }}</span>
    </div>

</body>

</html>
