import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart3, Clock, CalendarDays, Search, FileDown } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reportes', href: '/reportes' },
    { title: 'Histórico de Cliente', href: '/reportes/historico-cliente' },
];

const reportLinks = [
    { href: '/reportes', label: 'Reporte de Producción', icon: BarChart3 },
    { href: '/reportes/historico-cliente', label: 'Histórico de Cliente', icon: Clock },
    { href: '/reportes/resumen-mensual', label: 'Resumen Mensual', icon: CalendarDays },
];

interface Client {
    id: number;
    name: string;
}

interface Remission {
    id: number;
    remision?: string;
    order_number?: number;
    updated_at: string;
    quantity: number;
    fc?: string | number;
    pump?: boolean;
    work?: { id: number; name: string };
    concrete_type?: { id: number; type: string };
}

interface Props {
    clients: Client[];
    remissions: Remission[];
    total_quantity: number;
    filters: {
        client_id?: string;
        date_from?: string;
        date_to?: string;
    };
}

const selectClass =
    'border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm';

export default function ClientHistory({ clients, remissions, total_quantity, filters }: Props) {
    const today = new Date().toISOString().split('T')[0];
    const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];

    const [clientId, setClientId] = useState(filters.client_id ?? '');
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? oneMonthAgo);
    const [dateTo, setDateTo] = useState(filters.date_to ?? today);

    const handleSearch = () => {
        router.get('/reportes/historico-cliente', {
            client_id: clientId,
            date_from: dateFrom,
            date_to: dateTo,
        }, { preserveState: true });
    };

    const pdfUrl = () => {
        const params = new URLSearchParams({ client_id: clientId, date_from: dateFrom, date_to: dateTo });
        return `/reportes/historico-cliente/pdf?${params.toString()}`;
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const hasResults = remissions.length > 0;
    const hasFilters = clientId && dateFrom && dateTo;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Histórico de Cliente" />

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
                        const isActive = link.href === '/reportes/historico-cliente';
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

                {/* Filters */}
                <div className="rounded-xl border border-sidebar-border/70 p-6 bg-card shadow-sm space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Filtros</h3>
                    <div className="grid gap-4 sm:grid-cols-4">
                        <div className="grid gap-2">
                            <Label htmlFor="client_id">Cliente</Label>
                            <select
                                id="client_id"
                                className={selectClass}
                                value={clientId}
                                onChange={(e) => setClientId(e.target.value)}
                            >
                                <option value="">Seleccione cliente</option>
                                {clients.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date_from">Desde</Label>
                            <Input
                                id="date_from"
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date_to">Hasta</Label>
                            <Input
                                id="date_to"
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button id="btn-search" onClick={handleSearch} className="w-full gap-2">
                                <Search className="size-4" />
                                Buscar
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {hasFilters && (
                    <div className="rounded-xl border border-sidebar-border/70 bg-card shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-sidebar-border/70">
                            <p className="text-sm text-muted-foreground">
                                {hasResults ? `${remissions.length} remisión(es) encontrada(s)` : 'Sin resultados'}
                            </p>
                            {hasResults && (
                                <a href={pdfUrl()} target="_blank" rel="noreferrer">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <FileDown className="size-4" />
                                        Exportar PDF
                                    </Button>
                                </a>
                            )}
                        </div>

                        {hasResults ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-sidebar-border/70 bg-muted/50">
                                        <tr>
                                            <th className="p-3 font-medium text-left">Fecha</th>
                                            <th className="p-3 font-medium">Remisión</th>
                                            <th className="p-3 font-medium">Pedido</th>
                                            <th className="p-3 font-medium text-left">Obra</th>
                                            <th className="p-3 font-medium">Servicio</th>
                                            <th className="p-3 font-medium">Tipo</th>
                                            <th className="p-3 font-medium">Fc</th>
                                            <th className="p-3 font-medium">M³</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {remissions.map((r) => (
                                            <tr key={r.id} className="border-b border-sidebar-border/40 hover:bg-muted/30">
                                                <td className="p-3">{formatDate(r.updated_at)}</td>
                                                <td className="p-3 text-center">{r.remision ?? '-'}</td>
                                                <td className="p-3 text-center">{r.order_number ?? '-'}</td>
                                                <td className="p-3">{r.work?.name ?? '-'}</td>
                                                <td className="p-3 text-center">{r.pump ? 'Con Bomba' : 'Tiro Directo'}</td>
                                                <td className="p-3 text-center">{(r.concrete_type?.type ?? '-')}</td>
                                                <td className="p-3 text-center">{r.fc ?? '-'}</td>
                                                <td className="p-3 text-center font-medium">{Number(r.quantity).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-muted/50 font-semibold border-t border-sidebar-border/70">
                                        <tr>
                                            <td colSpan={7} className="p-3 text-right">Total M³ de Concreto:</td>
                                            <td className="p-3 text-center">{Number(total_quantity).toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center text-muted-foreground text-sm">
                                No se encontraron remisiones para el cliente y rango de fechas seleccionados.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
