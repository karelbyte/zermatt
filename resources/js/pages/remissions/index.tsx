import { Head, Link, router, usePage } from '@inertiajs/react';
import { FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '@/components/confirm-modal';
import { EmptyState } from '@/components/empty-state';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Remission } from '@/types';
import RemissionController from '@/actions/App/Http/Controllers/RemissionController';
import { create, edit, index } from '@/routes/remissions';

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
};

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

export default function RemissionsIndex({ remissions }: Props) {
    const { status } = usePage().props as { status?: string };
    const [remissionToDelete, setRemissionToDelete] = useState<Remission | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = () => {
        if (!remissionToDelete) return;
        setIsDeleting(true);
        router.delete(RemissionController.destroy(remissionToDelete).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setRemissionToDelete(null);
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
                    <Button asChild>
                        <Link href={create().url}>
                            <Plus className="mr-2 size-4" />
                            Nueva remisión
                        </Link>
                    </Button>
                </div>

                {status && (
                    <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                        {status}
                    </div>
                )}

                {remissions.data.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title="No hay remisiones"
                        description="Crea la primera remisión para comenzar."
                        action={
                            <Button asChild>
                                <Link href={create().url}>
                                    <Plus className="mr-2 size-4" />
                                    Nueva remisión
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-xl border border-sidebar-border/70">
                            <table className="w-full min-w-[800px] text-left text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/50">
                                    <tr>
                                        <th className="p-3 font-medium">Pedido</th>
                                        <th className="p-3 font-medium">Cliente</th>
                                        <th className="p-3 font-medium">Obra</th>
                                        <th className="p-3 font-medium">Cantidad</th>
                                        <th className="p-3 font-medium">Fecha salida</th>
                                        <th className="p-3 font-medium">Factura</th>
                                        <th className="p-3 text-right font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {remissions.data.map((r) => (
                                        <tr
                                            key={r.id}
                                            className="border-b border-sidebar-border/50 hover:bg-muted/30"
                                        >
                                            <td className="p-3">{r.order_number != null ? r.order_number : '—'}</td>
                                            <td className="p-3">{r.client?.name ?? '—'}</td>
                                            <td className="p-3">{r.work?.name ?? '—'}</td>
                                            <td className="p-3">{r.quantity != null ? r.quantity : '—'}</td>
                                            <td className="p-3">{formatDate(r.departure_date)}</td>
                                            <td className="p-3">{r.invoice ?? '—'}</td>
                                            <td className="flex justify-end gap-2 p-3">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={edit(r).url}>
                                                        <Pencil className="size-4" />
                                                        <span className="sr-only">Editar</span>
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => setRemissionToDelete(r)}
                                                >
                                                    <Trash2 className="size-4" />
                                                    <span className="sr-only">Eliminar</span>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {remissions.last_page > 1 && (
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {remissions.links.map((link, i) => (
                                    <span key={i}>
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                                                    }`}
                                            >
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <span className="px-3 py-1.5 text-muted-foreground">{link.label}</span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        )}
                    </>
                )}

                <ConfirmModal
                    open={!!remissionToDelete}
                    onOpenChange={(open) => !open && setRemissionToDelete(null)}
                    title="¿Eliminar remisión?"
                    description="Se eliminará la remisión. Esta acción no se puede deshacer."
                    confirmLabel="Eliminar"
                    cancelLabel="Cancelar"
                    variant="destructive"
                    loading={isDeleting}
                    onConfirm={handleConfirmDelete}
                />
            </div>
        </AppLayout>
    );
}
