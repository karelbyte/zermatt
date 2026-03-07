import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2, UserCog } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '@/components/confirm-modal';
import { EmptyState } from '@/components/empty-state';
import Heading from '@/components/heading';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Operator } from '@/types';
import OperatorController from '@/actions/App/Http/Controllers/OperatorController';
import { create, edit, index } from '@/routes/operators';

type PaginatedOperators = {
    data: Operator[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    operators: PaginatedOperators;
};

export default function OperatorsIndex({ operators }: Props) {
    const { status } = usePage().props as { status?: string };
    const [operatorToDelete, setOperatorToDelete] = useState<Operator | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = () => {
        if (!operatorToDelete) return;
        setIsDeleting(true);
        router.delete(OperatorController.destroy(operatorToDelete).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setOperatorToDelete(null);
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Operadores', href: index().url },
            ] as BreadcrumbItem[]}
        >
            <Head title="Operadores" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title="Operadores"
                        description="Gestiona los operadores de la aplicación"
                    />
                    <Button asChild>
                        <Link href={create().url}>
                            <Plus className="mr-2 size-4" />
                            Nuevo operador
                        </Link>
                    </Button>
                </div>

                {status && (
                    <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                        {status}
                    </div>
                )}

                {operators.data.length === 0 ? (
                    <EmptyState
                        icon={UserCog}
                        title="No hay operadores"
                        description="Aún no has registrado ningún operador. Crea el primero para comenzar."
                        action={
                            <Button asChild>
                                <Link href={create().url}>
                                    <Plus className="mr-2 size-4" />
                                    Nuevo operador
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
                                        <th className="p-3 font-medium">Dirección</th>
                                        <th className="p-3 font-medium">Teléfono</th>
                                        <th className="p-3 text-right font-medium">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {operators.data.map((operator) => (
                                        <tr
                                            key={operator.id}
                                            className="border-b border-sidebar-border/50 hover:bg-muted/30"
                                        >
                                            <td className="p-3">{operator.name}</td>
                                            <td className="max-w-[200px] truncate p-3">
                                                {operator.address ?? '—'}
                                            </td>
                                            <td className="p-3">{operator.phone ?? '—'}</td>
                                            <td className="flex justify-end gap-2 p-3">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={edit(operator).url}>
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
                                                    onClick={() => setOperatorToDelete(operator)}
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

                        {operators.last_page > 1 && (
                            <Pagination links={operators.links} className="mt-6" />
                        )}
                    </>
                )}

                <ConfirmModal
                    open={!!operatorToDelete}
                    onOpenChange={(open) => !open && setOperatorToDelete(null)}
                    title="¿Eliminar operador?"
                    description="Se eliminará el operador y sus datos. Esta acción no se puede deshacer."
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
