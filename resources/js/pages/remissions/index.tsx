import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, FileText, Pencil, Plus, Printer, Ban } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ConfirmModal } from '@/components/confirm-modal';
import { EmptyState } from '@/components/empty-state';
import Heading from '@/components/heading';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Remission } from '@/types';
import { create, edit, index, print } from '@/routes/remissions';

type PaginatedRemissions = {
    data: Remission[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    remissions: PaginatedRemissions;
    filters: {
        search: string | null;
    };
};
import { formatDate } from '@/lib/utils';

export default function RemissionsIndex({ remissions, filters }: Props) {
    const { status } = usePage().props as { status?: string };
    const [remissionToCancel, setRemissionToCancel] = useState<Remission | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(index().url, { search }, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true
                });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const handleConfirmCancel = () => {
        if (!remissionToCancel) return;
        setIsCancelling(true);
        router.patch(`/remissions/${remissionToCancel.id}/cancel`, {}, {
            preserveScroll: true,
            onFinish: () => {
                setIsCancelling(false);
                setRemissionToCancel(null);
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Remisiones', href: index().url },
            ] as BreadcrumbItem[]}
        >
            <Head title="Remisiones" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title="Remisiones"
                        description="Gestiona las remisiones"
                    />
                    <div className="flex items-center gap-2">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button asChild>
                            <Link href={create().url}>
                                <Plus className="mr-2 size-4" />
                                Nueva remisión
                            </Link>
                        </Button>
                    </div>
                </div>

                {status && (
                    <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                        {status}
                    </div>
                )}

                {remissions.data.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title={search ? "No se encontraron resultados" : "No hay remisiones"}
                        description={search ? `No se encontraron resultados para "${search}"` : "Crea la primera remisión para comenzar."}
                        action={!search && (
                            <Button asChild>
                                <Link href={create().url}>
                                    <Plus className="mr-2 size-4" />
                                    Nueva remisión
                                </Link>
                            </Button>
                        )}
                    />
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-xl border border-sidebar-border/70">
                            <table className="w-full min-w-[800px] text-left text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/50">
                                    <tr>
                                        <th className="p-3 font-medium">Remisión / Pedido</th>
                                        <th className="p-3 font-medium">Cliente / Obra</th>
                                        <th className="p-3 font-medium">Producto</th>
                                        <th className="p-3 font-medium text-center">Cantidad</th>
                                        <th className="p-3 font-medium text-center">Cemento</th>
                                        <th className="p-3 font-medium text-center">Arena</th>
                                        <th className="p-3 font-medium text-center">Grava</th>
                                        <th className="p-3 font-medium text-center">Agua</th>
                                        <th className="p-3 font-medium text-center">Salida</th>
                                        <th className="p-3 text-right font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {remissions.data.map((r) => (
                                        <tr
                                            key={r.id}
                                            className={`border-b border-sidebar-border/50 hover:bg-muted/30 ${r.status === 'cancelada' ? 'opacity-60' : ''}`}
                                        >
                                            <td className="p-3">
                                                <div className="font-medium text-foreground">{r.remision ?? '—'}</div>
                                                <div className="text-xs text-muted-foreground">Pedido: {r.order_number ?? '—'}</div>
                                                {r.status === 'cancelada' && (
                                                    <div className="mt-1 text-xs font-medium text-destructive">Cancelada</div>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <div className="font-medium text-foreground">{r.client?.name ?? '—'}</div>
                                                <div className="text-xs text-muted-foreground">{r.work?.name ?? '—'}</div>
                                            </td>
                                            <td className="p-3 text-xs">{r.product ?? '—'}</td>
                                            <td className="p-3 text-center">{r.quantity != null ? r.quantity : '—'}</td>
                                            <td className="p-3 text-center">{r.cement_amount ?? '—'}</td>
                                            <td className="p-3 text-center">{r.sand ?? '—'}</td>
                                            <td className="p-3 text-center">{r.gravel ?? '—'}</td>
                                            <td className="p-3 text-center">{r.water ?? '—'}</td>
                                            <td className="p-3 text-center">{formatDate(r.departure_date)}</td>
                                            <td className="flex justify-end gap-2 p-3">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <a href={print(r).url} target="_blank" rel="noreferrer">
                                                        <Printer className="size-4" />
                                                        <span className="sr-only">Imprimir</span>
                                                    </a>
                                                </Button>
                                                {r.status !== 'cancelada' && (
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={edit(r).url}>
                                                            <Pencil className="size-4" />
                                                            <span className="sr-only">Editar</span>
                                                        </Link>
                                                    </Button>
                                                )}
                                                {r.status !== 'cancelada' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => setRemissionToCancel(r)}
                                                    >
                                                        <Ban className="size-4" />
                                                        <span className="sr-only">Cancelar</span>
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {remissions.last_page > 1 && (
                            <Pagination links={remissions.links} className="mt-6" />
                        )}
                    </>
                )}

                <ConfirmModal
                    open={!!remissionToCancel}
                    onOpenChange={(open) => !open && setRemissionToCancel(null)}
                    title="¿Cancelar remisión?"
                    description="Se cancelará la remisión y las cantidades se pondrán en 0."
                    confirmLabel="Cancelar remisión"
                    cancelLabel="Volver"
                    variant="destructive"
                    loading={isCancelling}
                    onConfirm={handleConfirmCancel}
                />
            </div>
        </AppLayout>
    );
}
