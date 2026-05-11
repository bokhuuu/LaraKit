import { Head, router } from '@inertiajs/react';
import { Lock, Save, Shield, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Roles & Permissions', href: '/admin/roles' },
];

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface Props {
    allRoles: Role[];
    allPermissions: Permission[];
}

function formatRoleLabel(name: string): string {
    return name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function RolesIndex({ allRoles, allPermissions }: Props) {
    const [rolePermissions, setRolePermissions] = useState<
        Record<number, string[]>
    >(() =>
        Object.fromEntries(
            allRoles.map((role) => [
                role.id,
                role.permissions.map((p) => p.name),
            ]),
        ),
    );

    const [saving, setSaving] = useState<number | null>(null);

    const grouped = allPermissions.reduce(
        (acc, perm) => {
            const [group] = perm.name.split('.');

            if (!acc[group]) {
                acc[group] = [];
            }

            acc[group].push(perm);

            return acc;
        },
        {} as Record<string, Permission[]>,
    );

    const togglePermission = (roleId: number, permName: string) => {
        setRolePermissions((prev) => {
            const current = prev[roleId] ?? [];
            const has = current.includes(permName);

            return {
                ...prev,
                [roleId]: has
                    ? current.filter((p) => p !== permName)
                    : [...current, permName],
            };
        });
    };

    const handleSave = (role: Role) => {
        setSaving(role.id);
        router.put(
            `/admin/roles/${role.id}`,
            { permissions: rolePermissions[role.id] ?? [] },
            { onFinish: () => setSaving(null) },
        );
    };

    const isSuperAdmin = (role: Role) => role.name === 'super_admin';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles & Permissions" />

            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Roles & Permissions
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Assign permissions to roles. Super Admin is fixed and
                        cannot be modified.
                    </p>
                </div>

                <div className="grid gap-5">
                    {allRoles.map((role) => (
                        <Card
                            key={role.id}
                            className={isSuperAdmin(role) ? 'opacity-60' : ''}
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <div className="flex items-center gap-3">
                                    {isSuperAdmin(role) ? (
                                        <Lock className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <Shield className="h-5 w-5 text-primary" />
                                    )}
                                    <CardTitle className="text-base">
                                        {formatRoleLabel(role.name)}
                                    </CardTitle>
                                    <Badge
                                        variant={
                                            isSuperAdmin(role)
                                                ? 'secondary'
                                                : 'outline'
                                        }
                                    >
                                        {isSuperAdmin(role)
                                            ? 'All permissions'
                                            : `${rolePermissions[role.id]?.length ?? 0} permissions`}
                                    </Badge>
                                </div>

                                {!isSuperAdmin(role) && (
                                    <Button
                                        size="sm"
                                        onClick={() => handleSave(role)}
                                        disabled={saving === role.id}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {saving === role.id
                                            ? 'Saving...'
                                            : 'Save'}
                                    </Button>
                                )}
                            </CardHeader>

                            <Separator />

                            <CardContent className="pt-5">
                                {isSuperAdmin(role) ? (
                                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <ShieldCheck className="h-4 w-4" />
                                        Super Admin has all permissions by
                                        default and cannot be modified.
                                    </p>
                                ) : (
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {Object.entries(grouped).map(
                                            ([group, perms]) => (
                                                <div
                                                    key={group}
                                                    className="space-y-2"
                                                >
                                                    <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                                        {group}
                                                    </p>
                                                    {perms.map((perm) => {
                                                        const checked =
                                                            rolePermissions[
                                                                role.id
                                                            ]?.includes(
                                                                perm.name,
                                                            ) ?? false;
                                                        const action =
                                                            perm.name.split(
                                                                '.',
                                                            )[1];

                                                        return (
                                                            <div
                                                                key={perm.id}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Checkbox
                                                                    id={`${role.id}-${perm.name}`}
                                                                    checked={
                                                                        checked
                                                                    }
                                                                    onCheckedChange={() =>
                                                                        togglePermission(
                                                                            role.id,
                                                                            perm.name,
                                                                        )
                                                                    }
                                                                />
                                                                <label
                                                                    htmlFor={`${role.id}-${perm.name}`}
                                                                    className="cursor-pointer text-sm capitalize"
                                                                >
                                                                    {action}
                                                                </label>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
