import { Head, Link, router, usePage } from '@inertiajs/react';
import { HardHat, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '@/components/confirm-modal';
import { EmptyState } from '@/components/empty-state';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Obra } from '@/types';
import ObraController from '@/actions/App/Http/Controllers/ObraController';
import { create, edit, index } from '@/routes/obras';

type PaginatedObras = {
    data: Obra[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    obras: PaginatedObras;
};

export default function ObrasIndex({ obras }: Props) {
    const { status } = usePage().props as { status?: string };
    const [obraToDelete, setObraToDelete] = useState<Obra | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = () => {
        if (!obraToDelete) return;
        setIsDeleting(true);
        router.delete(ObraController.destroy(obraToDelete).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setObraToDelete(null);
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Obras', href: index().url },
            ] as BreadcrumbItem[]}
        >
            <Head title="Obras" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title="Obras"
                        description="Gestiona las obras de los clientes"
                    />
                    <Button asChild>
                        <Link href={create().url}>
                            <Plus className="mr-2 size-4" />
                            Nueva obra
                        </Link>
                    </Button>
                </div>

                {status && (
                    <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                        {status}
                    </div>
                )}

                {obras.data.length === 0 ? (
                    <EmptyState
                        icon={HardHat}
                        title="No hay obras"
                        description="Aún no has registrado ninguna obra. Crea la primera para comenzar."
                        action={
                            <Button asChild>
                                <Link href={create().url}>
                                    <Plus className="mr-2 size-4" />
                                    Nueva obra
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
                                        <th className="p-3 font-medium">Nombre</th>
                                        <th className="p-3 font-medium">Cliente</th>
                                        <th className="p-3 font-medium">Descripción</th>
                                        <th className="p-3 font-medium">Dirección</th>
                                        <th className="p-3 text-right font-medium">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {obras.data.map((obra) => (
                                        <tr
                                            key={obra.id}
                                            className="border-b border-sidebar-border/50 hover:bg-muted/30"
                                        >
                                            <td className="p-3">{obra.name}</td>
                                            <td className="p-3">
                                                {obra.client?.name ?? '—'}
                                            </td>
                                            <td className="max-w-[200px] truncate p-3">
                                                {obra.description ?? '—'}
                                            </td>
                                            <td className="max-w-[150px] truncate p-3">
                                                {obra.address ?? '—'}
                                            </td>
                                            <td className="flex justify-end gap-2 p-3">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={edit(obra).url}>
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
                                                    onClick={() => setObraToDelete(obra)}
                                                >
                                                    <Trash2 className="size-4" />
                                                    <span className="sr-only">
                                                        Eliminar
                                                    </span>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {obras.last_page > 1 && (
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {obras.links.map((link, i) => (
                                    <span key={i}>
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm ${
                                                    link.active
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'hover:bg-muted'
                                                }`}
                                            >
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <span className="px-3 py-1.5 text-muted-foreground">
                                                {link.label}
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        )}
                    </>
                )}

                <ConfirmModal
                    open={!!obraToDelete}
                    onOpenChange={(open) => !open && setObraToDelete(null)}
                    title="¿Eliminar obra?"
                    description="Se eliminará la obra y sus datos. Esta acción no se puede deshacer."
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
