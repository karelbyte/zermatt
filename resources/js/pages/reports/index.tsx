import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Remission } from '@/types';
import { DateProductionReport } from '@/components/date-production-report';
import Heading from '@/components/heading';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reportes',
        href: '/reportes',
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
            <Head title="Reportes de Producción" />
            
            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Reportes de Producción"
                    description="Consulta los reportes de producción por fecha"
                />

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
