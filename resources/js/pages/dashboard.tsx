import { Head, Link } from '@inertiajs/react';
import { Building2, Droplets, FileText, Package, Truck, Users, ArrowRight, Eye } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { edit as editRemission } from '@/routes/remissions';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel',
        href: dashboard().url,
    },
];

interface PropRemission {
    id: number;
    order_number: string | number | null;
    remision: string | null;
    client?: { name: string };
    work?: { name: string };
    product: string;
    departure_date: string;
    updated_at: string;
}

interface Props {
    total_additives: number;
    total_cement: number;
    count_clients: number;
    count_works: number;
    count_remissions: number;
    count_suppliers: number;
    recent_remissions: PropRemission[];
}

function formatDate(value: string | null): string {
    if (!value) return '—';
    // If it looks like a time (HH:MM or HH:MM:SS), just return it
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
        return value;
    }
    try {
        const date = new Date(value);
        if (isNaN(date.getTime())) return value;
        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    } catch {
        return value;
    }
}

export default function Dashboard({
    total_additives,
    total_cement,
    count_clients,
    count_works,
    count_remissions,
    count_suppliers,
    recent_remissions
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">

                {/* Recent Remissions Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold tracking-tight">Últimas 10 Remisiones</h2>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/remissions">
                                Ver todas
                                <ArrowRight className="ml-2 size-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 overflow-hidden bg-card">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-sidebar-border/70 bg-muted/50">
                                <tr>
                                    <th className="p-3 font-medium">Remisión / Pedido</th>
                                    <th className="p-3 font-medium">Cliente / Obra</th>
                                    <th className="p-3 font-medium">Producto</th>
                                    <th className="p-3 font-medium">Fecha</th>
                                    <th className="p-3 text-right font-medium">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent_remissions.map((remission) => (
                                    <tr key={remission.id} className="border-b border-sidebar-border/50 hover:bg-muted/30">
                                        <td className="p-3">
                                            <div className="font-medium text-foreground">{remission.remision ?? '—'}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase">Pedido: {remission.order_number ?? '—'}</div>
                                        </td>
                                        <td className="p-3">
                                            <div className="font-medium text-foreground">{remission.client?.name}</div>
                                            <div className="text-xs text-muted-foreground">{remission.work?.name}</div>
                                        </td>
                                        <td className="p-3 text-muted-foreground line-clamp-1 max-w-[200px]" title={remission.product}>
                                            {remission.product}
                                        </td>
                                        <td className="p-3 whitespace-nowrap">{formatDate(remission.updated_at)}</td>
                                        <td className="p-3 text-right">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={editRemission(remission).url}>
                                                    <Eye className="size-4" />
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {recent_remissions.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                                            No hay remisiones recientes
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        title="Clientes"
                        value={count_clients}
                        icon={<Users className="size-5" />}
                        subtitle="Clientes registrados"
                    />
                    <StatCard
                        title="Obras"
                        value={count_works}
                        icon={<Building2 className="size-5" />}
                        subtitle="Proyectos activos"
                    />
                    <StatCard
                        title="Remisiones"
                        value={count_remissions}
                        icon={<FileText className="size-5" />}
                        subtitle="Folios emitidos"
                    />
                    <StatCard
                        title="Proveedores"
                        value={count_suppliers}
                        icon={<Truck className="size-5" />}
                        subtitle="Aliados comerciales"
                    />
                    <StatCard
                        title="Inventario Cemento"
                        value={`${total_cement.toLocaleString('es-MX', { maximumFractionDigits: 1 })} Kg`}
                        icon={<Package className="size-5" />}
                        subtitle="Existencia actual"
                        variant="accent"
                    />
                    <StatCard
                        title="Inventario Aditivos"
                        value={`${total_additives.toLocaleString('es-MX', { maximumFractionDigits: 1 })} Lts`}
                        icon={<Droplets className="size-5" />}
                        subtitle="Existencia actual"
                        variant="accent"
                    />
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, icon, subtitle, variant = 'default' }: {
    title: string,
    value: string | number,
    icon: React.ReactNode,
    subtitle: string,
    variant?: 'default' | 'accent'
}) {
    return (
        <div className={`relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm transition-all hover:shadow-md ${variant === 'accent' ? 'ring-1 ring-primary/20' : ''}`}>
            <div className="flex items-center gap-4">
                <div className={`rounded-lg p-2 ${variant === 'accent' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground tracking-tight">{title}</h3>
                    <div className="text-2xl font-bold">{value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}
