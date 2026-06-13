import { Head, Link, router } from '@inertiajs/react';
import {
    Edit,
    FileText,
    FileDown,
    Plus,
    Search,
    Trash2,
    X,
    FileSpreadsheet,
} from 'lucide-react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { useTranslations } from '@/lib/i18n';
import type { BreadcrumbItem } from '@/types';
import * as PostController from '@actions/App/Modules/Posts/Controllers/PostController';

interface Tag {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface Author {
    id: number;
    name: string;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    status: string;
    published_at: string | null;
    category: Category | null;
    tags: Tag[];
    author: Author;
}

interface PaginatedPosts {
    data: Post[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Filters {
    search?: string;
    status?: string;
    category_id?: string;
}

interface Props {
    posts: PaginatedPosts;
    filters: Filters;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Posts', href: PostController.index.url() },
];

const STATUS_COLORS: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    published: 'bg-green-100 text-green-700',
    scheduled: 'bg-yellow-100 text-yellow-700',
};

export default function PostsIndex({ posts, filters }: Props) {
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);
    const [searchValue, setSearchValue] = useState(filters.search ?? '');

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(
            PostController.index.url(),
            {
                search: value,
                status: filters.status ?? '',
                category_id: filters.category_id ?? '',
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }, 300);

    function handleFilter(key: string, value: string) {
        router.get(
            PostController.index.url(),
            {
                search: filters.search ?? '',
                status: key === 'status' ? value : (filters.status ?? ''),
                category_id: filters.category_id ?? '',
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    const { __ } = useTranslations();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Posts</h1>
                    <div className="flex items-center gap-3">
                        <Link
                            href={PostController.trash.url()}
                            className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">View Trash</span>
                        </Link>
                        <a
                            href={PostController.exportExcel.url()}
                            className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            <FileSpreadsheet className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                Export Excel
                            </span>
                        </a>
                        <Link
                            href={PostController.create.url()}
                            className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">New Post</span>
                        </Link>
                    </div>
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                                debouncedSearch(e.target.value);
                            }}
                            placeholder="Search posts..."
                            className="w-full rounded-md border py-2 pr-4 pl-9 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                        />
                    </div>

                    <select
                        value={filters.status ?? ''}
                        onChange={(e) => handleFilter('status', e.target.value)}
                        className="rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                    >
                        <option value="">All Statuses</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="scheduled">Scheduled</option>
                    </select>

                    {(filters.search || filters.status) && (
                        <button
                            onClick={() => {
                                setSearchValue('');
                                router.get(
                                    PostController.index.url(),
                                    {},
                                    { preserveState: true, replace: true },
                                );
                            }}
                            className="text-sm text-muted-foreground hover:text-foreground"
                            title="Clear filters"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">
                                    {__('posts.title')}
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    {__('posts.status')}
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    {__('posts.category')}
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    {__('posts.tags')}
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    {__('posts.author')}
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    {__('posts.published_at')}
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    {__('posts.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-12 text-center text-muted-foreground"
                                    >
                                        <FileText className="mx-auto mb-2 h-8 w-8 opacity-40" />
                                        No posts found.
                                    </td>
                                </tr>
                            ) : (
                                posts.data.map((post) => (
                                    <tr
                                        key={post.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {post.title}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[post.status] ?? ''}`}
                                            >
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {post.category?.name ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {post.tags.map((tag) => (
                                                    <span
                                                        key={tag.id}
                                                        className="rounded-full bg-muted px-2 py-0.5 text-xs"
                                                    >
                                                        {tag.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {post.author.name}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {post.published_at
                                                ? new Date(
                                                      post.published_at,
                                                  ).toLocaleDateString()
                                                : '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    href={PostController.edit.url(
                                                        { post: post.id },
                                                    )}
                                                    className="text-muted-foreground hover:text-foreground"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>

                                                <a
                                                    href={PostController.exportPdf.url(
                                                        { post: post.id },
                                                    )}
                                                    target="_blank"
                                                    className="text-muted-foreground hover:text-foreground"
                                                    title="Export PDF"
                                                >
                                                    <FileDown className="h-4 w-4" />
                                                </a>
                                                <button
                                                    onClick={() =>
                                                        setPostToDelete(post)
                                                    }
                                                    className="text-red-400 hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        Showing {posts.data.length} of {posts.total} posts
                    </span>
                    <span>
                        Page {posts.current_page} of {posts.last_page}
                    </span>
                </div>

                {posts.last_page > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                        {posts.current_page > 1 && (
                            <Link
                                href={`${PostController.index.url()}?page=${posts.current_page - 1}`}
                                className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                            >
                                Previous
                            </Link>
                        )}
                        {Array.from(
                            { length: posts.last_page },
                            (_, i) => i + 1,
                        ).map((page) => (
                            <Link
                                key={page}
                                href={`${PostController.index.url()}?page=${page}`}
                                className={`rounded-md border px-3 py-1.5 text-sm ${page === posts.current_page ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                            >
                                {page}
                            </Link>
                        ))}
                        {posts.current_page < posts.last_page && (
                            <Link
                                href={`${PostController.index.url()}?page=${posts.current_page + 1}`}
                                className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                            >
                                Next
                            </Link>
                        )}
                    </div>
                )}
            </div>

            <AlertDialog
                open={postToDelete !== null}
                onOpenChange={() => setPostToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Move to Trash</AlertDialogTitle>
                        <AlertDialogDescription>
                            "{postToDelete?.title}" will be moved to trash. You
                            can restore it later.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (postToDelete) {
                                    router.delete(
                                        PostController.destroy.url({
                                            post: postToDelete.id,
                                        }),
                                    );
                                    setPostToDelete(null);
                                }
                            }}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Move to Trash
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
