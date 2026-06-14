import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Snapshot {
    horizon: 'running' | 'paused' | 'inactive' | 'disabled';
    redis: string;
    failed_jobs: number;
    versions: {
        php: string;
        laravel: string;
    };
    maintenance: boolean;
}

interface Props {
    snapshot: Snapshot;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Health', href: '/admin/system-health' },
];

function HorizonBadge({ status }: { status: Snapshot['horizon'] }) {
    const styles: Record<Snapshot['horizon'], string> = {
        running: 'bg-green-100 text-green-700',
        paused: 'bg-yellow-100 text-yellow-700',
        inactive: 'bg-red-100 text-red-700',
        disabled: 'bg-gray-100 text-gray-500',
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${styles[status]}`}
        >
            {status}
        </span>
    );
}

export default function SystemHealthIndex({ snapshot }: Props) {
    const [processing, setProcessing] = useState<string | null>(null);

    function clearCache(type: 'config' | 'route' | 'view') {
        setProcessing(type);
        router.post(
            '/admin/system-health/cache',
            { type },
            { onFinish: () => setProcessing(null) },
        );
    }

    function toggleMaintenance() {
        setProcessing('maintenance');
        router.post(
            '/admin/system-health/maintenance',
            {},
            { onFinish: () => setProcessing(null) },
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Health" />
            <div className="max-w-4xl space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold">System Health</h1>
                    <p className="text-sm text-muted-foreground">
                        Infrastructure status and maintenance controls.
                    </p>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Horizon */}
                    <div className="space-y-2 rounded-lg border bg-card p-4">
                        <p className="text-xs tracking-wide text-muted-foreground uppercase">
                            Horizon
                        </p>
                        <HorizonBadge status={snapshot.horizon} />
                    </div>

                    {/* Redis */}
                    <div className="space-y-2 rounded-lg border bg-card p-4">
                        <p className="text-xs tracking-wide text-muted-foreground uppercase">
                            Redis Memory
                        </p>
                        <p className="text-lg font-semibold">
                            {snapshot.redis}
                        </p>
                    </div>

                    {/* Failed Jobs */}
                    <div className="space-y-2 rounded-lg border bg-card p-4">
                        <p className="text-xs tracking-wide text-muted-foreground uppercase">
                            Failed Jobs
                        </p>
                        <p
                            className={`text-lg font-semibold ${snapshot.failed_jobs > 0 ? 'text-red-600' : 'text-green-600'}`}
                        >
                            {snapshot.failed_jobs}
                        </p>
                    </div>

                    {/* Versions */}
                    <div className="space-y-2 rounded-lg border bg-card p-4">
                        <p className="text-xs tracking-wide text-muted-foreground uppercase">
                            Versions
                        </p>
                        <p className="text-sm">PHP {snapshot.versions.php}</p>
                        <p className="text-sm">
                            Laravel {snapshot.versions.laravel}
                        </p>
                    </div>
                </div>

                {/* Cache Controls */}
                <div className="space-y-4 rounded-lg border bg-card p-5">
                    <div>
                        <h2 className="text-sm font-semibold">Cache</h2>
                        <p className="text-xs text-muted-foreground">
                            Clear compiled caches. Run after config or route
                            changes.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {(['config', 'route', 'view'] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => clearCache(type)}
                                disabled={processing !== null}
                                className="rounded-md border px-4 py-2 text-sm font-medium capitalize hover:bg-accent disabled:opacity-50"
                            >
                                {processing === type
                                    ? 'Clearing...'
                                    : `Clear ${type} cache`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Maintenance Mode */}
                <div className="space-y-4 rounded-lg border bg-card p-5">
                    <div>
                        <h2 className="text-sm font-semibold">
                            Maintenance Mode
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            {snapshot.maintenance
                                ? 'App is currently in maintenance mode. Users see a 503 page.'
                                : 'App is live. Toggle to put it into maintenance mode.'}
                        </p>
                    </div>
                    <button
                        onClick={toggleMaintenance}
                        disabled={processing !== null}
                        className={`rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 ${
                            snapshot.maintenance
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                    >
                        {processing === 'maintenance'
                            ? 'Updating...'
                            : snapshot.maintenance
                              ? 'Disable Maintenance Mode'
                              : 'Enable Maintenance Mode'}
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
