import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Remission } from '@/types';
import { DateProductionReport } from '@/components/date-production-report';
import Heading from '@/components/heading';
import { BarChart3, Clock, CalendarDays } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reportes', href: '/reportes' },
];

const reportLinks = [
    {
        href: '/reportes',
        label: 'Reporte de Producción',
        description: 'Producción diaria por fecha',
        icon: BarChart3,
    },
    {
        href: '/reportes/historico-cliente',
        label: 'Histórico de Cliente',
        description: 'Remisiones por cliente y rango de fechas',
        icon: Clock,
    },
    {
        href: '/reportes/resumen-mensual',
        label: 'Resumen Mensual',
        description: 'Total de concreto producido por mes',
        icon: CalendarDays,
    },
];

interface Props {
    daily_remissions: Remission[];
    inventory_stats: {
        cement: { received: number; used: number; previous: number; current: number };
        additives: { received: number; used: number; previous: number; current: number };
        fibers: { received: number; used: number; previous: number; current: number };
        waterproofings: { received: number; used: number; previous: number; current: number };
    };
    selected_date: string;
}

export default function ReportsIndex({
    daily_remissions,
    inventory_stats,
    selected_date,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reportes" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Reportes"
                    description="Consulta los distintos reportes del sistema"
                />

                {/* Report Navigation Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    {reportLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = typeof window !== 'undefined' && window.location.pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-start gap-4 rounded-xl border p-5 transition-all hover:shadow-md ${
                                    isActive
                                        ? 'border-primary bg-primary/5 shadow-sm'
                                        : 'border-sidebar-border/70 bg-card hover:border-primary/40'
                                }`}
                            >
                                <div className="rounded-lg bg-primary/10 p-2">
                                    <Icon className="size-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{link.label}</p>
                                    <p className="text-xs text-muted-foreground">{link.description}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Production Report Content */}
                <div className="rounded-xl border border-sidebar-border/70 p-6 bg-card shadow-sm">
                    <DateProductionReport
                        remissions={daily_remissions}
                        inventoryStats={inventory_stats}
                        selectedDate={selected_date}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
