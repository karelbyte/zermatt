import { Head, Link, router, usePage } from '@inertiajs/react';
import { Layers, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '@/components/confirm-modal';
import { EmptyState } from '@/components/empty-state';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { ConcreteType } from '@/types';
import ConcreteTypeController from '@/actions/App/Http/Controllers/ConcreteTypeController';
import { create, edit, index } from '@/routes/concrete-types';

type PaginatedConcreteTypes = {
    data: ConcreteType[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    concreteTypes: PaginatedConcreteTypes;
};

export default function ConcreteTypesIndex({ concreteTypes }: Props) {
    const { status } = usePage().props as { status?: string };
    const [typeToDelete, setTypeToDelete] = useState<ConcreteType | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = () => {
        if (!typeToDelete) return;
        setIsDeleting(true);
        router.delete(ConcreteTypeController.destroy(typeToDelete.id).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setTypeToDelete(null);
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Tipos de Concretos', href: index().url },
            ] as BreadcrumbItem[]}
        >
            <Head title="Tipos de Concretos" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title="Tipos de Concretos"
                        description="Gestiona la lista de precios por tipo de concreto"
                    />
                    <Button asChild>
                        <Link href={create().url}>
                            <Plus className="mr-2 size-4" />
                            Nuevo precio
                        </Link>
                    </Button>
                </div>

                {status && (
                    <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                        {status}
                    </div>
                )}

                {concreteTypes.data.length === 0 ? (
                    <EmptyState
                        icon={Layers}
                        title="No hay precios registrados"
                        description="Aún no has registrado ningún precio de concreto. Crea el primero para comenzar."
                        action={
                            <Button asChild>
                                <Link href={create().url}>
                                    <Plus className="mr-2 size-4" />
                                    Nuevo precio
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
                                        <th className="p-3 font-medium">Tipo</th>
                                        <th className="p-3 font-medium">Concepto</th>
                                        <th className="p-3 font-medium">Descripción</th>
                                        <th className="p-3 font-medium">Activo</th>
                                        <th className="p-3 text-right font-medium">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {concreteTypes.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-sidebar-border/50 hover:bg-muted/30"
                                        >
                                            <td className="p-3">{item.type}</td>
                                            <td className="p-3">{item.concept ?? '—'}</td>
                                            <td className="p-3">{item.description ?? '—'}</td>
                                            <td className="p-3">
                                                {item.active === true ? 'Sí' : item.active === false ? 'No' : '—'}
                                            </td>
                                            <td className="flex justify-end gap-2 p-3">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={edit(item.id).url}>
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
                                                    onClick={() => setTypeToDelete(item)}
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

                        {concreteTypes.last_page > 1 && (
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {concreteTypes.links.map((link, i) => (
                                    <span key={i}>
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm ${link.active
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
                    open={!!typeToDelete}
                    onOpenChange={(open) => !open && setTypeToDelete(null)}
                    title="¿Eliminar precio?"
                    description="Se eliminará la configuración de precio y sus datos. Esta acción no se puede deshacer."
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
