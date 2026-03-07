import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Building2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ConfirmModal } from '@/components/confirm-modal';
import { EmptyState } from '@/components/empty-state';
import Heading from '@/components/heading';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Client } from '@/types';
import ClientController from '@/actions/App/Http/Controllers/ClientController';
import { create, edit, index } from '@/routes/clients';

type PaginatedClients = {
    data: Client[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    clients: PaginatedClients;
    filters: {
        search: string | null;
    };
};

export default function ClientsIndex({ clients, filters }: Props) {
    const { status } = usePage().props as { status?: string };
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
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

    const handleConfirmDelete = () => {
        if (!clientToDelete) return;
        setIsDeleting(true);
        router.delete(ClientController.destroy(clientToDelete).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setClientToDelete(null);
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Clientes', href: index().url },
            ] as BreadcrumbItem[]}
        >
            <Head title="Clientes" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title="Clientes"
                        description="Gestiona los clientes de la aplicación"
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
                                Nuevo cliente
                            </Link>
                        </Button>
                    </div>
                </div>

                {status && (
                    <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                        {status}
                    </div>
                )}

                {clients.data.length === 0 ? (
                    <EmptyState
                        icon={Building2}
                        title={search ? "No se encontraron resultados" : "No hay clientes"}
                        description={search ? `No se encontraron resultados para "${search}"` : "Aún no has registrado ningún cliente. Crea el primero para comenzar."}
                        action={!search && (
                            <Button asChild>
                                <Link href={create().url}>
                                    <Plus className="mr-2 size-4" />
                                    Nuevo cliente
                                </Link>
                            </Button>
                        )}
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
                                    {clients.data.map((client) => (
                                        <tr
                                            key={client.id}
                                            className="border-b border-sidebar-border/50 hover:bg-muted/30"
                                        >
                                            <td className="p-3">{client.name}</td>
                                            <td className="max-w-[200px] truncate p-3">
                                                {client.address ?? '—'}
                                            </td>
                                            <td className="p-3">{client.phone ?? '—'}</td>
                                            <td className="p-3">{client.rfc ?? '—'}</td>
                                            <td className="flex justify-end gap-2 p-3">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={edit(client).url}>
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
                                                    onClick={() => setClientToDelete(client)}
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

                        {clients.last_page > 1 && (
                            <Pagination links={clients.links} className="mt-6" />
                        )}
                    </>
                )}

                <ConfirmModal
                    open={!!clientToDelete}
                    onOpenChange={(open) => !open && setClientToDelete(null)}
                    title="¿Eliminar cliente?"
                    description="Se eliminará el cliente y sus datos. Esta acción no se puede deshacer."
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
