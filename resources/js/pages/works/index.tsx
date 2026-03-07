import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, HardHat, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ConfirmModal } from '@/components/confirm-modal';
import { EmptyState } from '@/components/empty-state';
import Heading from '@/components/heading';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Work } from '@/types';
import WorkController from '@/actions/App/Http/Controllers/WorkController';
import { create, edit, index } from '@/routes/works';

type PaginatedWorks = {
    data: Work[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    works: PaginatedWorks;
    filters: {
        search: string | null;
    };
};

export default function WorksIndex({ works, filters }: Props) {
    const { status } = usePage().props as { status?: string };
    const [workToDelete, setWorkToDelete] = useState<Work | null>(null);
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
        if (!workToDelete) return;
        setIsDeleting(true);
        router.delete(WorkController.destroy(workToDelete).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setWorkToDelete(null);
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
                                Nueva obra
                            </Link>
                        </Button>
                    </div>
                </div>

                {status && (
                    <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                        {status}
                    </div>
                )}

                {works.data.length === 0 ? (
                    <EmptyState
                        icon={HardHat}
                        title={search ? "No se encontraron resultados" : "No hay obras"}
                        description={search ? `No se encontraron resultados para "${search}"` : "Aún no has registrado ninguna obra. Crea la primera para comenzar."}
                        action={!search && (
                            <Button asChild>
                                <Link href={create().url}>
                                    <Plus className="mr-2 size-4" />
                                    Nueva obra
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
                                        <th className="p-3 font-medium">Cliente</th>
                                        <th className="p-3 font-medium">Descripción</th>
                                        <th className="p-3 font-medium">Dirección</th>
                                        <th className="p-3 text-right font-medium">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {works.data.map((work) => (
                                        <tr
                                            key={work.id}
                                            className="border-b border-sidebar-border/50 hover:bg-muted/30"
                                        >
                                            <td className="p-3">{work.name}</td>
                                            <td className="p-3">
                                                {work.client?.name ?? '—'}
                                            </td>
                                            <td className="max-w-[200px] truncate p-3">
                                                {work.description ?? '—'}
                                            </td>
                                            <td className="max-w-[150px] truncate p-3">
                                                {work.address ?? '—'}
                                            </td>
                                            <td className="flex justify-end gap-2 p-3">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={edit(work).url}>
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
                                                    onClick={() => setWorkToDelete(work)}
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

                        {works.last_page > 1 && (
                            <Pagination links={works.links} className="mt-6" />
                        )}
                    </>
                )}

                <ConfirmModal
                    open={!!workToDelete}
                    onOpenChange={(open) => !open && setWorkToDelete(null)}
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
