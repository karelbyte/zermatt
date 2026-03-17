import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Building2, CookingPot, FileText, FlaskConical, HardHat, PaintBucket, Layers, LayoutGrid, Package, Tag, Truck, UserCog, Users, UserCheck2Icon, ScrollText, BarChart3, Waves } from 'lucide-react';
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
    useSidebar,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';
import { index as clientsIndex } from '@/routes/clients';
import { index as worksIndex } from '@/routes/works';
import { index as potsIndex } from '@/routes/pots';
import { index as operatorsIndex } from '@/routes/operators';
import { index as cementsIndex } from '@/routes/cements';
import { index as additivesIndex } from '@/routes/additives';
import { index as fibersIndex } from '@/routes/fibers';
import { index as waterproofingsIndex } from '@/routes/waterproofings';
import { index as suppliersIndex } from '@/routes/suppliers';
import { index as usersIndex } from '@/routes/users';
import { index as concreteTypesIndex } from '@/routes/concrete-types';
import { index as designsIndex } from '@/routes/designs';
import { index as usagesIndex } from '@/routes/usages';
import { index as remissionsIndex } from '@/routes/remissions';

const mainNavItems: NavItem[] = [
    {
        title: 'Panel',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Reportes',
        href: '/reportes',
        icon: BarChart3,
    },
    {
        title: 'Clientes',
        href: clientsIndex(),
        icon: UserCheck2Icon,
    },
    {
        title: 'Obras',
        href: worksIndex(),
        icon: Building2,
    },
    {
        title: 'Operadores',
        href: operatorsIndex(),
        icon: UserCog,
    },
    {
        title: 'Proveedores',
        href: suppliersIndex(),
        icon: Truck,
    },

    {
        title: 'Ollas',
        href: potsIndex(),
        icon: CookingPot,
    },

    {
        title: 'Cemento',
        href: cementsIndex(),
        icon: Package,
    },
    {
        title: 'Aditivos',
        href: additivesIndex(),
        icon: FlaskConical,
    },
    {
        title: 'Fibras',
        href: fibersIndex(),
        icon: Waves,
    },
    {
        title: 'Impermeabilizantes',
        href: waterproofingsIndex(),
        icon: PaintBucket,
    },
    {
        title: 'Usos',
        href: usagesIndex(),
        icon: Tag,
    },
    {
        title: 'Tipos de Concretos',
        href: concreteTypesIndex(),
        icon: Layers,
    },
    {
        title: 'Diseños',
        href: designsIndex(),
        icon: BookOpen,
    },
    {
        title: 'Remisiones',
        href: remissionsIndex(),
        icon: FileText,
    },

    {
        title: 'Usuarios',
        href: usersIndex(),
        icon: Users,
    },
    {
        title: 'Logs',
        href: '/logs',
        icon: ScrollText,
    },
];

const footerNavItems: NavItem[] = [
    /* {
         title: 'Repositorio',
         href: 'https://github.com/laravel/react-starter-kit',
         icon: Folder,
     },
     {
         title: 'Documentación',
         href: 'https://laravel.com/docs/starter-kits#react',
         icon: BookOpen,
     },*/
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const user = auth.user;

    const filteredNavItems = mainNavItems.filter((item) => {
        if (user.is_admin) {
            return true;
        }

        return user.permissions?.includes(item.title);
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarLogoWrapper />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

function SidebarLogoWrapper() {
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    return (
        <div className="flex items-center gap-2">
            <Link href={dashboard()} prefetch>
                {isCollapsed ? (
                    <img
                        src="/olla.png"
                        alt="Zermatt"
                        className="size-8 shrink-0 rounded-md object-contain"
                    />
                ) : (
                    <AppLogo />
                )}
            </Link>
        </div>
    );
}
