import { Head, Link, router, usePage } from '@inertiajs/react';
import { CookingPot, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '@/components/confirm-modal';
import { EmptyState } from '@/components/empty-state';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Pot } from '@/types';
import PotController from '@/actions/App/Http/Controllers/PotController';
import { create, edit, index } from '@/routes/pots';

type PaginatedPots = {
    data: Pot[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    pots: PaginatedPots;
};

export default function PotsIndex({ pots }: Props) {
    const { status } = usePage().props as { status?: string };
    const [potToDelete, setPotToDelete] = useState<Pot | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = () => {
        if (!potToDelete) return;
        setIsDeleting(true);
        router.delete(PotController.destroy(potToDelete).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setPotToDelete(null);
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Ollas', href: index().url },
            ] as BreadcrumbItem[]}
        >
            <Head title="Ollas" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title="Ollas"
                        description="Gestiona las ollas de la aplicación"
                    />
                    <Button asChild>
                        <Link href={create().url}>
                            <Plus className="mr-2 size-4" />
                            Nueva olla
                        </Link>
                    </Button>
                </div>

                {status && (
                    <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                        {status}
                    </div>
                )}

                {pots.data.length === 0 ? (
                    <EmptyState
                        icon={CookingPot}
                        title="No hay ollas"
                        description="Aún no has registrado ninguna olla. Crea la primera para comenzar."
                        action={
                            <Button asChild>
                                <Link href={create().url}>
                                    <Plus className="mr-2 size-4" />
                                    Nueva olla
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
                                        <th className="p-3 font-medium">Número</th>
                                        <th className="p-3 font-medium">Capacidad m³ </th>
                                        <th className="p-3 font-medium">Activa</th>
                                        <th className="p-3 text-right font-medium">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pots.data.map((pot) => (
                                        <tr
                                            key={pot.id}
                                            className="border-b border-sidebar-border/50 hover:bg-muted/30"
                                        >
                                            <td className="p-3">{pot.number}</td>
                                            <td className="p-3">
                                                {pot.capacity != null
                                                    ? pot.capacity
                                                    : '—'}
                                            </td>
                                            <td className="p-3">
                                                {pot.active ? 'Sí' : 'No'}
                                            </td>
                                            <td className="flex justify-end gap-2 p-3">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={edit(pot).url}>
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
                                                    onClick={() => setPotToDelete(pot)}
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

                        {pots.last_page > 1 && (
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {pots.links.map((link, i) => (
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
                    open={!!potToDelete}
                    onOpenChange={(open) => !open && setPotToDelete(null)}
                    title="¿Eliminar olla?"
                    description="Se eliminará la olla y sus datos. Esta acción no se puede deshacer."
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
