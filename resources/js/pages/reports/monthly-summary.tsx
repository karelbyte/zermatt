import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';
import { BarChart3, Clock, CalendarDays } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reportes', href: '/reportes' },
    { title: 'Resumen Mensual', href: '/reportes/resumen-mensual' },
];

const reportLinks = [
    { href: '/reportes', label: 'Reporte de Producción', icon: BarChart3 },
    { href: '/reportes/historico-cliente', label: 'Histórico de Cliente', icon: Clock },
    { href: '/reportes/resumen-mensual', label: 'Resumen Mensual', icon: CalendarDays },
];

const monthNames = [
    '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

interface MonthlySummaryRow {
    year: number;
    month: number;
    total_quantity: number;
    total_remissions: number;
}

interface Props {
    monthly: MonthlySummaryRow[];
}

export default function MonthlySummary({ monthly }: Props) {
    const grandTotal = monthly.reduce((acc, row) => acc + Number(row.total_quantity), 0);

    // Compute cumulative totals: since 'monthly' is descending, we reverse it,
    // compute running sums from oldest to newest, then reverse back.
    const withCumulative = (() => {
        let running = 0;
        return [...monthly].reverse().map((row) => {
            running += Number(row.total_quantity);
            return { ...row, cumulative: running };
        }).reverse();
    })();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resumen Mensual" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Reportes"
                    description="Consulta los distintos reportes del sistema"
                />

                {/* Report Navigation */}
                <div className="grid gap-4 sm:grid-cols-3">
                    {reportLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = link.href === '/reportes/resumen-mensual';
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
                                <p className="font-medium text-sm">{link.label}</p>
                            </Link>
                        );
                    })}
                </div>

                {/* Monthly Table */}
                <div className="rounded-xl border border-sidebar-border/70 bg-card shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-sidebar-border/70">
                        <p className="text-sm text-muted-foreground">
                            Total de m³ de concreto producido por mes, en orden descendente.
                        </p>
                    </div>

                    {monthly.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/50">
                                    <tr>
                                        <th className="p-3 font-medium text-left">Mes</th>
                                        <th className="p-3 font-medium text-center">Año</th>
                                        <th className="p-3 font-medium text-center">Remisiones</th>
                                        <th className="p-3 font-medium text-center">Total M³</th>
                                        <th className="p-3 font-medium text-center">Acumulado M³</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {withCumulative.map((row) => (
                                        <tr
                                            key={`${row.year}-${row.month}`}
                                            className="border-b border-sidebar-border/40 hover:bg-muted/30"
                                        >
                                            <td className="p-3 font-medium">{monthNames[row.month]}</td>
                                            <td className="p-3 text-center text-muted-foreground">{row.year}</td>
                                            <td className="p-3 text-center">{row.total_remissions}</td>
                                            <td className="p-3 text-center font-semibold">
                                                {Number(row.total_quantity).toFixed(2)}
                                            </td>
                                            <td className="p-3 text-center text-muted-foreground">
                                                {row.cumulative.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-muted/50 font-semibold border-t border-sidebar-border/70">
                                    <tr>
                                        <td colSpan={2} className="p-3 text-right">Gran Total:</td>
                                        <td className="p-3 text-center">
                                            {monthly.reduce((acc, r) => acc + Number(r.total_remissions), 0)}
                                        </td>
                                        <td className="p-3 text-center">{grandTotal.toFixed(2)}</td>
                                        <td className="p-3 text-center">{grandTotal.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center text-muted-foreground text-sm">
                            No hay datos de producción registrados aún.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
