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
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import { formatRole } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    roles: Role[];
    deleted_at: string;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    users: PaginatedUsers;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Users', href: '/admin/users' },
    { title: 'Trash', href: '/admin/users/trashed' },
];

export default function TrashedUsers({ users }: Props) {
    const [userToForceDelete, setUserToForceDelete] = useState<number | null>(
        null,
    );
    const { canManageUser } = useAuth();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trashed Users" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Trashed Users</h1>
                    <Link
                        href="/admin/users"
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        ← Back to Users
                    </Link>
                </div>

                {users.data.length === 0 ? (
                    <div className="rounded-lg border p-12 text-center text-muted-foreground">
                        No trashed users found.
                    </div>
                ) : (
                    <div className="rounded-lg border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="px-4 py-3 text-left font-medium">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Role
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
                                {users.data.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-4 py-3">
                                            {user.name}
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.email}
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.roles.length > 0
                                                ? formatRole(user.roles[0].name)
                                                : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {new Date(
                                                user.deleted_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {canManageUser(user) && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                router.patch(
                                                                    `/admin/users/${user.id}/restore`,
                                                                )
                                                            }
                                                            className="text-green-500 hover:text-green-700"
                                                            title="Restore"
                                                        >
                                                            <RotateCcw className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setUserToForceDelete(
                                                                    user.id,
                                                                )
                                                            }
                                                            className="text-red-400 hover:text-red-600"
                                                            title="Permanently Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
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
                        Showing {users.data.length} of {users.total} trashed
                        users
                    </span>
                    <span>
                        Page {users.current_page} of {users.last_page}
                    </span>
                </div>

                {users.last_page > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                        {users.current_page > 1 && (
                            <Link
                                href={`/admin/users/trashed?page=${users.current_page - 1}`}
                                className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                            >
                                Previous
                            </Link>
                        )}
                        {Array.from(
                            { length: users.last_page },
                            (_, i) => i + 1,
                        ).map((page) => (
                            <Link
                                key={page}
                                href={`/admin/users/trashed?page=${page}`}
                                className={`rounded-md border px-3 py-1.5 text-sm ${
                                    page === users.current_page
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-muted'
                                }`}
                            >
                                {page}
                            </Link>
                        ))}
                        {users.current_page < users.last_page && (
                            <Link
                                href={`/admin/users/trashed?page=${users.current_page + 1}`}
                                className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                            >
                                Next
                            </Link>
                        )}
                    </div>
                )}

                <AlertDialog
                    open={userToForceDelete !== null}
                    onOpenChange={() => setUserToForceDelete(null)}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Permanently Delete User
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. The user will be
                                permanently removed from the database.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    if (userToForceDelete) {
                                        router.delete(
                                            `/admin/users/${userToForceDelete}/force-delete`,
                                        );
                                        setUserToForceDelete(null);
                                    }
                                }}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete Forever
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
