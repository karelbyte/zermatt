import { Link } from '@inertiajs/react';
import { BookOpen, Building2, CookingPot, Folder, HardHat, Layers, LayoutGrid, Package, Truck, UserCog, Users } from 'lucide-react';
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
import { index as obrasIndex } from '@/routes/obras';
import { index as ollasIndex } from '@/routes/ollas';
import { index as operatorsIndex } from '@/routes/operators';
import { index as cementsIndex } from '@/routes/cements';
import { index as suppliersIndex } from '@/routes/suppliers';
import { index as usersIndex } from '@/routes/users';
import { index as concreteTypesIndex } from '@/routes/concrete-types';

const mainNavItems: NavItem[] = [
    {
        title: 'Panel',
        href: dashboard(),
        icon: LayoutGrid,
    },
 
    {
        title: 'Clientes',
        href: clientsIndex(),
        icon: Building2,
    },
    {
        title: 'Obras',
        href: obrasIndex(),
        icon: HardHat,
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
        href: ollasIndex(),
        icon: CookingPot,
    },

    {
        title: 'Cemento',
        href: cementsIndex(),
        icon: Package,
    },
    {
        title: 'Tipos de concreto',
        href: concreteTypesIndex(),
        icon: Layers,
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
