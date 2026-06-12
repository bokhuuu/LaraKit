import { Head, Link, router } from '@inertiajs/react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
import type { BreadcrumbItem } from '@/types';
import * as PostController from '@actions/App/Modules/Posts/Controllers/PostController';

interface Post {
    id: number;
    title: string;
    status: string;
    deleted_at: string;
    author: { id: number; name: string };
}

interface PaginatedPosts {
    data: Post[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    posts: PaginatedPosts;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Posts', href: PostController.index.url() },
    { title: 'Trash', href: PostController.trash.url() },
];

export default function PostsTrash({ posts }: Props) {
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts Trash" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Trashed Posts</h1>
                    <Link
                        href={PostController.index.url()}
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        ← Back to Posts
                    </Link>
                </div>

                {posts.data.length === 0 ? (
                    <div className="rounded-lg border p-12 text-center text-muted-foreground">
                        No trashed posts found.
                    </div>
                ) : (
                    <div className="rounded-lg border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="px-4 py-3 text-left font-medium">
                                        Title
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Author
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Deleted
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.data.map((post) => (
                                    <tr
                                        key={post.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {post.title}
                                        </td>
                                        <td className="px-4 py-3">
                                            {post.author.name}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {new Date(
                                                post.deleted_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        router.post(
                                                            PostController.restore.url(
                                                                { id: post.id },
                                                            ),
                                                        )
                                                    }
                                                    className="text-green-500 hover:text-green-700"
                                                    title="Restore"
                                                >
                                                    <RotateCcw className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setPostToDelete(post)
                                                    }
                                                    className="text-red-400 hover:text-red-600"
                                                    title="Permanently Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        Showing {posts.data.length} of {posts.total} trashed
                        posts
                    </span>
                    <span>
                        Page {posts.current_page} of {posts.last_page}
                    </span>
                </div>

                {posts.last_page > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                        {posts.current_page > 1 && (
                            <Link
                                href={`${PostController.trash.url()}?page=${posts.current_page - 1}`}
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
                                href={`${PostController.trash.url()}?page=${page}`}
                                className={`rounded-md border px-3 py-1.5 text-sm ${page === posts.current_page ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                            >
                                {page}
                            </Link>
                        ))}
                        {posts.current_page < posts.last_page && (
                            <Link
                                href={`${PostController.trash.url()}?page=${posts.current_page + 1}`}
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
                        <AlertDialogTitle>Permanently Delete</AlertDialogTitle>
                        <AlertDialogDescription>
                            "{postToDelete?.title}" will be permanently deleted.
                            This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (postToDelete) {
                                    router.delete(
                                        PostController.forceDelete.url({
                                            id: postToDelete.id,
                                        }),
                                    );
                                    setPostToDelete(null);
                                }
                            }}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete Forever
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
