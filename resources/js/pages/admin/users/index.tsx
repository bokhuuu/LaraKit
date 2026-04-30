import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Search } from 'lucide-react';
import { useState, useRef } from 'react';
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
    avatar: string | null;
    avatar_url: string;
    roles: Role[];
    created_at: string;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Filters {
    search?: string;
    role?: string;
    status?: string;
}

interface Props {
    users: PaginatedUsers;
    filters: Filters;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Users', href: '/admin/users' },
];

export default function UsersIndex({ users, filters }: Props) {
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const { isSuperAdmin, canManageUser } = useAuth();

    function handleSearch(value: string) {
        if (searchRef.current) {
            clearTimeout(searchRef.current);
        }

        searchRef.current = setTimeout(() => {
            router.get(
                '/admin/users',
                {
                    search: value,
                    role: filters.role ?? '',
                    status: filters.status ?? '',
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);
    }

    function handleFilter(key: string, value: string) {
        router.get(
            '/admin/users',
            {
                search: filters.search ?? '',
                role: key === 'role' ? value : (filters.role ?? ''),
                status: key === 'status' ? value : (filters.status ?? ''),
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Users</h1>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/users/trashed"
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            View Trash
                        </Link>

                        <Link
                            href="/admin/users/create"
                            className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4" />
                            Create User
                        </Link>
                    </div>
                </div>

                <div className="mb-4 flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                                handleSearch(e.target.value);
                            }}
                            placeholder="Search by name or email..."
                            className="w-full rounded-md border py-2 pr-4 pl-9 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                        />
                    </div>

                    <select
                        value={filters.role ?? ''}
                        onChange={(e) => handleFilter('role', e.target.value)}
                        className="rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                    >
                        <option value="">All Roles</option>
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                    </select>

                    <select
                        value={filters.status ?? ''}
                        onChange={(e) => handleFilter('status', e.target.value)}
                        className="rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    {(filters.search || filters.role || filters.status) && (
                        <button
                            onClick={() => {
                                setSearchValue('');
                                router.get(
                                    '/admin/users',
                                    {},
                                    { preserveState: true, replace: true },
                                );
                            }}
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            Clear
                        </button>
                    )}
                </div>

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
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Created
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
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted text-xs font-semibold">
                                                {user.avatar_url ? (
                                                    <img
                                                        src={user.avatar_url}
                                                        alt={user.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    user.name
                                                        .charAt(0)
                                                        .toUpperCase()
                                                )}
                                            </div>
                                            {user.name}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3">
                                        {user.roles.length > 0
                                            ? formatRole(user.roles[0].name)
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                user.is_active
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {user.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {new Date(
                                            user.created_at,
                                        ).toLocaleDateString()}
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {!(
                                                user.roles[0]?.name ===
                                                    'super_admin' &&
                                                !isSuperAdmin
                                            ) && (
                                                <Link
                                                    href={`/admin/users/${user.id}/edit`}
                                                    className="text-muted-foreground hover:text-foreground"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            )}

                                            {canManageUser(user) && (
                                                <button
                                                    onClick={() =>
                                                        setUserToDelete(user.id)
                                                    }
                                                    className="text-red-400 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        Showing {users.data.length} of {users.total} users
                    </span>
                    <span>
                        Page {users.current_page} of {users.last_page}
                    </span>
                </div>

                {users.last_page > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                        {users.current_page > 1 && (
                            <Link
                                href={`/admin/users?page=${users.current_page - 1}&search=${filters.search ?? ''}&role=${filters.role ?? ''}&status=${filters.status ?? ''}`}
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
                                href={`/admin/users?page=${page}&search=${filters.search ?? ''}&role=${filters.role ?? ''}&status=${filters.status ?? ''}`}
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
                                href={`/admin/users?page=${users.current_page + 1}&search=${filters.search ?? ''}&role=${filters.role ?? ''}&status=${filters.status ?? ''}`}
                                className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                            >
                                Next
                            </Link>
                        )}
                    </div>
                )}

                <AlertDialog
                    open={userToDelete !== null}
                    onOpenChange={() => setUserToDelete(null)}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. The user will be
                                soft deleted.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    if (userToDelete) {
                                        router.delete(
                                            `/admin/users/${userToDelete}`,
                                        );
                                        setUserToDelete(null);
                                    }
                                }}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
