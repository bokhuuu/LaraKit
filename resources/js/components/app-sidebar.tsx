import { Link } from '@inertiajs/react';
import {
    Settings,
    Users,
    LayoutGrid,
    Activity,
    ShieldCheck,
    FileText,
    KeyRound,
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

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { isSuperAdmin } = useAuth();

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Users',
            href: '/admin/users',
            icon: Users,
        },
        ...(isSuperAdmin
            ? [
                  {
                      title: 'Roles & Permissions',
                      href: '/admin/roles',
                      icon: ShieldCheck,
                  },
              ]
            : []),
        {
            title: 'Site Settings',
            href: '/admin/settings',
            icon: Settings,
        },
        {
            title: 'Activity Log',
            href: '/admin/activity-log',
            icon: Activity,
        },
        {
            title: 'Posts',
            href: '/admin/posts',
            icon: FileText,
        },
        {
            title: 'API Tokens',
            href: '/admin/tokens',
            icon: KeyRound,
        },
    ];

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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
