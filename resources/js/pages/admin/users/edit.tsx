import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Role {
    id: number;
    name: string;
    label: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    roles: Role[];
}

interface Props {
    user: User;
    roles: Role[];
}

export default function EditUser({ user, roles }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Users', href: '/admin/users' },
        { title: user.name, href: `/admin/users/${user.id}/edit` },
    ];
    const { isAdmin, user: currentUser } = useAuth();
    const isEditingSelf = user.id === currentUser?.id;
    const isEditingSuperAdmin = user.roles[0]?.name === 'super_admin';
    const canChangeRole = !isEditingSelf && (!isAdmin || !isEditingSuperAdmin);
    const canChangeStatus = !isEditingSelf;

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.roles[0]?.name ?? '',
        is_active: user.is_active,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${user.name}`} />
            <div className="flex justify-center p-6">
                <div className="w-full max-w-xl">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Edit User</h1>
                        <Link
                            href="/admin/users"
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            ← Back to Users
                        </Link>
                    </div>

                    <div className="rounded-lg border p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {(errors as Record<string, string>).general && (
                                <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {(errors as Record<string, string>).general}
                                </div>
                            )}

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    New Password
                                    <span className="ml-1 text-xs text-muted-foreground">
                                        (leave blank to keep current)
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    autoComplete="new-password"
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Leave blank to keep current"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    autoComplete="new-password"
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                    placeholder="Leave blank to keep current"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Role
                                    {!canChangeRole && (
                                        <span className="ml-1 text-xs text-muted-foreground">
                                            (read only)
                                        </span>
                                    )}
                                </label>
                                <Select
                                    value={data.role}
                                    onValueChange={(value) =>
                                        setData('role', value)
                                    }
                                    disabled={!canChangeRole}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem
                                                key={role.id}
                                                value={role.name}
                                            >
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.role}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData('is_active', e.target.checked)
                                    }
                                    disabled={!canChangeStatus}
                                    className="h-4 w-4 rounded border"
                                />
                                <label
                                    htmlFor="is_active"
                                    className="text-sm font-medium"
                                >
                                    Active
                                    {!canChangeStatus && (
                                        <span className="ml-1 text-xs text-muted-foreground">
                                            (read only)
                                        </span>
                                    )}
                                </label>
                            </div>
                            {errors.is_active && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.is_active}
                                </p>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
