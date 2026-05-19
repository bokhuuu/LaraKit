import { router, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { read, readAll } from '@/routes/admin/notifications';
import type { AdminNotification } from '@/types/notifications';

export function NotificationBell() {
    const { notifications } = usePage().props;
    const unreadCount = notifications.length;

    function markAsRead(id: string) {
        router.post(read(id).url, {}, { preserveScroll: true });
    }

    function markAllAsRead() {
        router.post(readAll().url, {}, { preserveScroll: true });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between border-b px-3 py-2">
                    <span className="text-sm font-semibold">Notifications</span>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-muted-foreground hover:text-foreground"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>
                {unreadCount === 0 ? (
                    <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                        No new notifications
                    </div>
                ) : (
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.map(
                            (notification: AdminNotification) => (
                                <div
                                    key={notification.id}
                                    className="flex cursor-pointer items-start justify-between gap-2 border-b px-3 py-2 last:border-0 hover:bg-muted"
                                    onClick={() => {
                                        markAsRead(notification.id);
                                        router.visit(
                                            `/admin/users/${notification.user_id}/edit`,
                                        );
                                    }}
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm">
                                            {notification.message}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {notification.created_at}
                                        </span>
                                    </div>
                                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                                </div>
                            ),
                        )}
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
