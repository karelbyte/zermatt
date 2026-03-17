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
import type { Waterproofing } from '@/types';
import WaterproofingController from '@/actions/App/Http/Controllers/WaterproofingController';
import { create, edit, index } from '@/routes/waterproofings';

type PaginatedWaterproofings = {
    data: Waterproofing[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    waterproofings: PaginatedWaterproofings;
};
import { formatDate } from '@/lib/utils';

export default function WaterproofingsIndex({ waterproofings }: Props) {
    const { status, auth } = usePage().props as any;
    const user = auth.user;
    const [waterproofingToDelete, setWaterproofingToDelete] = useState<Waterproofing | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = () => {
        if (!waterproofingToDelete) return;
        setIsDeleting(true);
        router.delete(WaterproofingController.destroy(waterproofingToDelete).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setWaterproofingToDelete(null);
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Impermeabilizantes', href: index().url },
            ] as BreadcrumbItem[]}
        >
            <Head title="Impermeabilizantes" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title="Impermeabilizantes"
                        description="Registro de entradas de impermeabilizantes por fecha y proveedor"
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

                {waterproofings.data.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title="No hay registros de impermeabilizantes"
                        description="Aún no has registrado ninguna entrada de impermeabilizantes. Crea la primera para comenzar."
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
                                        <th className="p-3 font-medium">Litros</th>
                                        <th className="p-3 font-medium">Proveedor</th>
                                        <th className="p-3 font-medium">Documento</th>
                                        <th className="p-3 font-medium text-center">Estado</th>
                                        <th className="p-3 text-right font-medium">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {waterproofings.data.map((waterproofing) => (
                                        <tr
                                            key={waterproofing.id}
                                            className="border-b border-sidebar-border/50 hover:bg-muted/30"
                                        >
                                            <td className="p-3">
                                                {formatDate(waterproofing.date)}
                                            </td>
                                            <td className="p-3">
                                                {waterproofing.lit != null
                                                    ? Number(waterproofing.lit).toLocaleString('es-MX')
                                                    : '—'}
                                            </td>
                                            <td className="p-3">
                                                {waterproofing.supplier?.name ?? '—'}
                                            </td>
                                            <td className="p-3">
                                                {waterproofing.document ?? '—'}
                                            </td>
                                            <td className="p-3 text-center">
                                                <Badge variant={waterproofing.status === 'closed' ? 'default' : 'outline'}>
                                                    {waterproofing.status === 'closed' ? 'Cerrado' : 'Abierto'}
                                                </Badge>
                                            </td>
                                            <td className="flex justify-end gap-2 p-3">
                                                {(waterproofing.status === 'open' || user.is_admin) && (
                                                    <>
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={edit(waterproofing).url}>
                                                                <Pencil className="size-4" />
                                                                <span className="sr-only">Editar</span>
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => setWaterproofingToDelete(waterproofing)}
                                                        >
                                                            <Trash2 className="size-4" />
                                                            <span className="sr-only">Eliminar</span>
                                                        </Button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {waterproofings.last_page > 1 && (
                            <Pagination links={waterproofings.links} className="mt-6" />
                        )}
                    </>
                )}

                <ConfirmModal
                    open={!!waterproofingToDelete}
                    onOpenChange={(open) => !open && setWaterproofingToDelete(null)}
                    title="¿Eliminar registro?"
                    description="Se eliminará este registro de impermeabilizante. Esta acción no se puede deshacer."
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
