import { usePage } from '@inertiajs/react';

interface Role {
    id: number;
    name: string;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

interface PageProps {
    [key: string]: unknown;
    auth: {
        user: AuthUser;
    };
}

export function useAuth() {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const role = user?.roles?.[0]?.name ?? '';

    return {
        user,
        role,
        isSuperAdmin: role === 'super_admin',
        isAdmin: role === 'admin',
    };
}
