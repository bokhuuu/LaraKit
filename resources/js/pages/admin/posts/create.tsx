import { Head, Link, useForm } from '@inertiajs/react';
import { TiptapEditor } from '@/components/tiptap-editor';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import * as PostController from '@actions/App/Modules/Posts/Controllers/PostController';

interface Category {
    id: number;
    name: string;
}

interface Tag {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
    tags: Tag[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Posts', href: PostController.index.url() },
    { title: 'New Post', href: PostController.create.url() },
];

export default function CreatePost({ categories, tags }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        body: '',
        excerpt: '',
        status: 'draft',
        category_id: '',
        tag_ids: [] as number[],
        meta_title: '',
        meta_description: '',
        published_at: '',
        featured_image: null as File | null,
    });

    const toggleTag = (tagId: number) => {
        const current = data.tag_ids;

        setData(
            'tag_ids',
            current.includes(tagId)
                ? current.filter((id) => id !== tagId)
                : [...current, tagId],
        );
    };

    function handleSubmit() {
        post(PostController.store.url(), { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Post" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">New Post</h1>
                    <Link
                        href={PostController.index.url()}
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        ← Back to Posts
                    </Link>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Main */}
                    <div className="flex-1 space-y-4">
                        <div className="space-y-4 rounded-lg border p-6">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder="Post title"
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Excerpt
                                </label>
                                <textarea
                                    value={data.excerpt}
                                    onChange={(e) =>
                                        setData('excerpt', e.target.value)
                                    }
                                    placeholder="Short summary..."
                                    rows={3}
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Content
                                </label>
                                <TiptapEditor
                                    content={data.body}
                                    onChange={(value) => setData('body', value)}
                                    placeholder="Write your post content here..."
                                />
                            </div>
                        </div>

                        {/* SEO */}
                        <div className="space-y-4 rounded-lg border p-6">
                            <p className="text-sm font-medium">SEO</p>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    value={data.meta_title}
                                    onChange={(e) =>
                                        setData('meta_title', e.target.value)
                                    }
                                    placeholder="SEO title..."
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Meta Description
                                </label>
                                <textarea
                                    value={data.meta_description}
                                    onChange={(e) =>
                                        setData(
                                            'meta_description',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="SEO description (max 160 chars)..."
                                    rows={3}
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full space-y-4 lg:w-72">
                        <div className="space-y-4 rounded-lg border p-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Status
                                </label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) =>
                                        setData('status', value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">
                                            Draft
                                        </SelectItem>
                                        <SelectItem value="published">
                                            Published
                                        </SelectItem>
                                        <SelectItem value="scheduled">
                                            Scheduled
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {data.status === 'scheduled' && (
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Publish Date
                                    </label>
                                    <input
                                        type="date"
                                        value={
                                            data.published_at
                                                ? data.published_at.split(
                                                      'T',
                                                  )[0]
                                                : ''
                                        }
                                        onChange={(e) =>
                                            setData(
                                                'published_at',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Category
                                </label>
                                <Select
                                    value={data.category_id}
                                    onValueChange={(value) =>
                                        setData('category_id', value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem
                                                key={cat.id}
                                                value={String(cat.id)}
                                            >
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Tags
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            onClick={() => toggleTag(tag.id)}
                                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                                data.tag_ids.includes(tag.id)
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                            }`}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                    {tags.length === 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            No tags available.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Featured Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData(
                                            'featured_image',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                    className="w-full text-sm text-muted-foreground"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={processing}
                                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Create Post'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
