import { Head, Link, router, usePage } from '@inertiajs/react';
import { Package, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '@/components/confirm-modal';
import { EmptyState } from '@/components/empty-state';
import Heading from '@/components/heading';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Cement } from '@/types';
import CementController from '@/actions/App/Http/Controllers/CementController';
import { create, edit, index } from '@/routes/cements';

type PaginatedCements = {
    data: Cement[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    cements: PaginatedCements;
};
import { formatDate } from '@/lib/utils';

export default function CementIndex({ cements }: Props) {
    const { status, auth } = usePage().props as any;
    const user = auth.user;
    const [cementToDelete, setCementToDelete] = useState<Cement | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = () => {
        if (!cementToDelete) return;
        setIsDeleting(true);
        router.delete(CementController.destroy(cementToDelete).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setCementToDelete(null);
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Cemento', href: index().url },
            ] as BreadcrumbItem[]}
        >
            <Head title="Cemento" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title="Cemento"
                        description="Registro de entradas de cemento por fecha, kilogramos y proveedor"
                    />
                    <Button asChild>
                        <Link href={create().url}>
                            <Plus className="mr-2 size-4" />
                            Nuevo registro
                        </Link>
                    </Button>
                </div>

                {status && (
                    <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                        {status}
                    </div>
                )}

                {cements.data.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title="No hay registros de cemento"
                        description="Aún no has registrado ninguna entrada de cemento. Crea la primera para comenzar."
                        action={
                            <Button asChild>
                                <Link href={create().url}>
                                    <Plus className="mr-2 size-4" />
                                    Nuevo registro
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <>
                        <div className="rounded-xl border border-sidebar-border/70 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/50">
                                    <tr>
                                        <th className="p-3 font-medium">Fecha</th>
                                        <th className="p-3 font-medium">Kilogramos</th>
                                        <th className="p-3 font-medium">Proveedor</th>
                                        <th className="p-3 font-medium">Documento</th>
                                        <th className="p-3 font-medium text-center">Estado</th>
                                        <th className="p-3 text-right font-medium">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cements.data.map((cement) => (
                                        <tr
                                            key={cement.id}
                                            className="border-b border-sidebar-border/50 hover:bg-muted/30"
                                        >
                                            <td className="p-3">
                                                {formatDate(cement.date)}
                                            </td>
                                            <td className="p-3">
                                                {cement.tons != null
                                                    ? Number(cement.tons).toLocaleString('es-MX')
                                                    : '—'}
                                            </td>
                                            <td className="p-3">
                                                {cement.supplier?.name ?? '—'}
                                            </td>
                                            <td className="p-3">
                                                {cement.document ?? '—'}
                                            </td>
                                            <td className="p-3 text-center">
                                                <Badge variant={cement.status === 'closed' ? 'default' : 'outline'}>
                                                    {cement.status === 'closed' ? 'Cerrado' : 'Abierto'}
                                                </Badge>
                                            </td>
                                            <td className="flex justify-end gap-2 p-3">
                                                {(cement.status === 'open' || user.is_admin) && (
                                                    <>
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={edit(cement).url}>
                                                                <Pencil className="size-4" />
                                                                <span className="sr-only">
                                                                    Editar
                                                                </span>
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => setCementToDelete(cement)}
                                                        >
                                                            <Trash2 className="size-4" />
                                                            <span className="sr-only">
                                                                Eliminar
                                                            </span>
                                                        </Button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {cements.last_page > 1 && (
                            <Pagination links={cements.links} className="mt-6" />
                        )}
                    </>
                )}

                <ConfirmModal
                    open={!!cementToDelete}
                    onOpenChange={(open) => !open && setCementToDelete(null)}
                    title="¿Eliminar registro?"
                    description="Se eliminará este registro de cemento. Esta acción no se puede deshacer."
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
