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

    function canManageUser(targetUser: {
        id: number;
        roles: { name: string }[];
    }): boolean {
        if (targetUser.roles[0]?.name === 'super_admin') {
            return false;
        }

        if (role === 'admin' && targetUser.roles[0]?.name === 'admin') {
            return false;
        }

        if (role === 'editor' || role === 'viewer') {
            return false;
        }

        if (targetUser.id === user?.id) {
            return false;
        }

        return true;
    }

    return {
        user,
        role,
        isSuperAdmin: role === 'super_admin',
        isAdmin: role === 'admin',
        canManageUser,
    };
}
