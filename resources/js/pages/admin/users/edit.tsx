import { Head, Link, useForm } from '@inertiajs/react';
import { Camera, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useRef, useState } from 'react';
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
    last_login_at: string | null;
    last_login_ip: string | null;
    last_login_agent: string | null;
}

interface Props {
    user: User;
    roles: Role[];
    avatarUrl: string;
}

export default function EditUser({ user, roles, avatarUrl }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Users', href: '/admin/users' },
        { title: user.name, href: `/admin/users/${user.id}/edit` },
    ];
    const { isAdmin, user: currentUser } = useAuth();
    const isEditingSelf = user.id === currentUser?.id;
    const isEditingSuperAdmin = user.roles[0]?.name === 'super_admin';
    const canChangeRole = !isEditingSelf && (!isAdmin || !isEditingSuperAdmin);
    const canChangeStatus = !isEditingSelf;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(avatarUrl || null);

    const { data, setData, put, processing, errors } = useForm({
        _method: 'PUT',
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.roles[0]?.name ?? '',
        is_active: user.is_active,
        avatar: null as File | null,
        remove_avatar: false,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put(`/admin/users/${user.id}`, {
            forceFormData: true,
        });
    }

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setData('avatar', file);

        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    }

    function handleRemoveAvatar() {
        setData('avatar', null);
        setData('remove_avatar', true);
        setPreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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

                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border bg-muted">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Avatar"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xl font-semibold text-muted-foreground">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="rounded-md border p-2 text-muted-foreground hover:text-foreground"
                                        title={
                                            preview
                                                ? 'Change avatar'
                                                : 'Upload avatar'
                                        }
                                    >
                                        <Camera className="h-4 w-4" />
                                    </button>
                                    {preview && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveAvatar}
                                            className="rounded-md border p-2 text-red-400 hover:text-red-600"
                                            title="Remove avatar"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        JPG, PNG or WebP. Max 2MB.
                                    </p>
                                </div>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />

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

                            {user.last_login_at && (
                                <div className="space-y-1 rounded-md border bg-muted/40 px-4 py-3 text-sm">
                                    <p className="font-medium text-muted-foreground">
                                        Last Login
                                    </p>
                                    <p>
                                        {new Date(
                                            user.last_login_at,
                                        ).toLocaleString()}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {user.last_login_ip}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {user.last_login_agent}
                                    </p>
                                </div>
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
