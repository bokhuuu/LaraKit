import type { Auth } from '@/types/auth';
import type { AdminNotification } from '@/types/notifications';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            notifications: AdminNotification[];
            [key: string]: unknown;
        };
    }
}
