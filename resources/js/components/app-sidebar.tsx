import { Link } from '@inertiajs/react';
import { BookOpen, Building2, CookingPot, FileText, FlaskConical, HardHat, Layers, LayoutGrid, Package, Tag, Truck, UserCog, Users, UserCheck2Icon } from 'lucide-react';
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
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';
import { index as clientsIndex } from '@/routes/clients';
import { index as worksIndex } from '@/routes/works';
import { index as potsIndex } from '@/routes/pots';
import { index as operatorsIndex } from '@/routes/operators';
import { index as cementsIndex } from '@/routes/cements';
import { index as additivesIndex } from '@/routes/additives';
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
        title: 'Usos',
        href: usagesIndex(),
        icon: Tag,
    },
    {
        title: 'Tipos de concreto',
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
