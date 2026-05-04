import { Head, Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Activity {
    id: number;
    log_name: string;
    description: string;
    subject_type: string | null;
    event: string;
    causer: { id: number; name: string; avatar_url: string } | null;
    attribute_changes: {
        old: Record<string, string>;
        attributes: Record<string, string>;
    } | null;
    created_at: string;
}

interface PaginatedActivities {
    data: Activity[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    activities: PaginatedActivities;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Activity Log', href: '/admin/activity-log' },
];

function eventBadgeClass(event: string): string {
    switch (event) {
        case 'created':
            return 'bg-green-100 text-green-700';
        case 'updated':
            return 'bg-blue-100 text-blue-700';
        case 'deleted':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-muted text-muted-foreground';
    }
}

export default function ActivityLog({ activities }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Log" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Activity Log</h1>
                    <p className="text-sm text-muted-foreground">
                        Full audit trail of all actions in the panel.
                    </p>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="px-4 py-3 text-left font-medium">
                                    User
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Event
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Model
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Changes
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Time
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.data.map((activity) => (
                                <tr
                                    key={activity.id}
                                    className="border-b last:border-0"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted text-xs font-semibold">
                                                {activity.causer?.avatar_url ? (
                                                    <img
                                                        src={
                                                            activity.causer
                                                                .avatar_url
                                                        }
                                                        alt={
                                                            activity.causer.name
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    (activity.causer?.name
                                                        .charAt(0)
                                                        .toUpperCase() ?? '?')
                                                )}
                                            </div>
                                            <span>
                                                {activity.causer?.name ??
                                                    'System'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${eventBadgeClass(activity.event)}`}
                                        >
                                            {activity.event}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {activity.subject_type
                                            ?.split('\\')
                                            .pop()}
                                    </td>
                                    <td className="px-4 py-3">
                                        {activity.attribute_changes?.old ? (
                                            <div className="text-xs text-muted-foreground">
                                                {Object.entries(
                                                    activity.attribute_changes
                                                        .old,
                                                ).map(([key, oldVal]) => (
                                                    <div key={key}>
                                                        <span>{key}: </span>
                                                        <span className="line-through">
                                                            {String(oldVal)}
                                                        </span>
                                                        {' → '}
                                                        <span className="text-foreground">
                                                            {String(
                                                                activity
                                                                    .attribute_changes
                                                                    ?.attributes[
                                                                    key
                                                                ],
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {formatDistanceToNow(
                                            new Date(activity.created_at),
                                            { addSuffix: true },
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {activities.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No activity recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        Showing {activities.data.length} of {activities.total}{' '}
                        activities
                    </span>
                    <span>
                        Page {activities.current_page} of {activities.last_page}
                    </span>
                </div>

                {activities.last_page > 1 && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                        {activities.current_page > 1 && (
                            <Link
                                href={`/admin/activity-log?page=${activities.current_page - 1}`}
                                className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                            >
                                Previous
                            </Link>
                        )}
                        {Array.from(
                            { length: activities.last_page },
                            (_, i) => i + 1,
                        ).map((page) => (
                            <Link
                                key={page}
                                href={`/admin/activity-log?page=${page}`}
                                className={`rounded-md border px-3 py-1.5 text-sm ${page === activities.current_page ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                            >
                                {page}
                            </Link>
                        ))}
                        {activities.current_page < activities.last_page && (
                            <Link
                                href={`/admin/activity-log?page=${activities.current_page + 1}`}
                                className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                            >
                                Next
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
