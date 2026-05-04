import { Head, Link } from '@inertiajs/react';
import { Users, Activity } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Stats {
    total_users: number;
    active_users: number;
    inactive_users: number;
    trashed_users: number;
    total_activities: number;
    today_activities: number;
}

interface Props {
    stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
];

export default function Dashboard({ stats }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        Welcome back. Here's what's happening.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Link
                        href="/admin/users"
                        className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-muted-foreground">
                                Users
                            </p>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="mt-2 text-3xl font-bold">
                            {stats.total_users}
                        </p>
                        <div className="mt-2 flex gap-3 text-xs">
                            <span className="text-green-500">
                                {stats.active_users} active
                            </span>
                            <span className="text-red-400">
                                {stats.inactive_users} inactive
                            </span>
                            <span className="text-orange-500">
                                {stats.trashed_users} trashed
                            </span>
                        </div>
                    </Link>

                    <Link
                        href="/admin/activity-log"
                        className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-muted-foreground">
                                Activity Log
                            </p>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="mt-2 text-3xl font-bold">
                            {stats.total_activities}
                        </p>
                        <div className="mt-2 flex gap-3 text-xs">
                            <span className="text-blue-500">
                                {stats.today_activities} today
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
