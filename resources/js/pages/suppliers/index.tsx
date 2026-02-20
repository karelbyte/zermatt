import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Truck } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '@/components/confirm-modal';
import { EmptyState } from '@/components/empty-state';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Supplier } from '@/types';
import SupplierController from '@/actions/App/Http/Controllers/SupplierController';
import { create, edit, index } from '@/routes/suppliers';

type PaginatedSuppliers = {
    data: Supplier[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    suppliers: PaginatedSuppliers;
};

export default function SuppliersIndex({ suppliers }: Props) {
    const { status } = usePage().props as { status?: string };
    const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = () => {
        if (!supplierToDelete) return;
        setIsDeleting(true);
        router.delete(SupplierController.destroy(supplierToDelete).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setSupplierToDelete(null);
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Proveedores', href: index().url },
            ] as BreadcrumbItem[]}
        >
            <Head title="Proveedores" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title="Proveedores"
                        description="Gestiona los proveedores de la aplicación"
                    />
                    <Button asChild>
                        <Link href={create().url}>
                            <Plus className="mr-2 size-4" />
                            Nuevo proveedor
                        </Link>
                    </Button>
                </div>

                {status && (
                    <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                        {status}
                    </div>
                )}

                {suppliers.data.length === 0 ? (
                    <EmptyState
                        icon={Truck}
                        title="No hay proveedores"
                        description="Aún no has registrado ningún proveedor. Crea el primero para comenzar."
                        action={
                            <Button asChild>
                                <Link href={create().url}>
                                    <Plus className="mr-2 size-4" />
                                    Nuevo proveedor
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
                                        <th className="p-3 font-medium">RFC</th>
                                        <th className="p-3 text-right font-medium">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suppliers.data.map((supplier) => (
                                        <tr
                                            key={supplier.id}
                                            className="border-b border-sidebar-border/50 hover:bg-muted/30"
                                        >
                                            <td className="p-3">{supplier.name}</td>
                                            <td className="max-w-[200px] truncate p-3">
                                                {supplier.address ?? '—'}
                                            </td>
                                            <td className="p-3">{supplier.phone ?? '—'}</td>
                                            <td className="p-3">{supplier.rfc ?? '—'}</td>
                                            <td className="flex justify-end gap-2 p-3">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={edit(supplier).url}>
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
                                                    onClick={() => setSupplierToDelete(supplier)}
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

                        {suppliers.last_page > 1 && (
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {suppliers.links.map((link, i) => (
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
                    open={!!supplierToDelete}
                    onOpenChange={(open) => !open && setSupplierToDelete(null)}
                    title="¿Eliminar proveedor?"
                    description="Se eliminará el proveedor y sus datos. Esta acción no se puede deshacer."
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
