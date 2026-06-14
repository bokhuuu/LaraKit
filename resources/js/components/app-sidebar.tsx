import { Link } from '@inertiajs/react';
import {
    Settings,
    Users,
    LayoutGrid,
    Activity,
    ShieldCheck,
    FileText,
    KeyRound,
    HeartPulse,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { dashboard } from '@/routes/admin';
import type { NavItem } from '@/types';
import { LocaleSwitcher } from './locale-switcher';

interface NavItemWithRoles extends NavItem {
    roles: string[];
}

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { role } = useAuth();

    const allNavItems: NavItemWithRoles[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
            roles: ['super_admin', 'admin', 'editor'],
        },
        {
            title: 'Users',
            href: '/admin/users',
            icon: Users,
            roles: ['super_admin', 'admin'],
        },
        {
            title: 'Roles & Permissions',
            href: '/admin/roles',
            icon: ShieldCheck,
            roles: ['super_admin'],
        },
        {
            title: 'System Health',
            href: '/admin/system-health',
            icon: HeartPulse,
            roles: ['super_admin'],
        },
        {
            title: 'Site Settings',
            href: '/admin/settings',
            icon: Settings,
            roles: ['super_admin', 'admin'],
        },
        {
            title: 'Activity Log',
            href: '/admin/activity-log',
            icon: Activity,
            roles: ['super_admin', 'admin'],
        },
        {
            title: 'Posts',
            href: '/admin/posts',
            icon: FileText,
            roles: ['super_admin', 'admin', 'editor'],
        },
        {
            title: 'API Tokens',
            href: '/admin/tokens',
            icon: KeyRound,
            roles: ['super_admin', 'admin'],
        },
    ];

    const mainNavItems = allNavItems.filter((item) =>
        item.roles.includes(role),
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <div className="px-2 py-1">
                    <LocaleSwitcher />
                </div>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
