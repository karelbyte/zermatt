import { Head, Link, router, usePage } from '@inertiajs/react';
import { BookOpen, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '@/components/confirm-modal';
import { EmptyState } from '@/components/empty-state';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Design } from '@/types';
import DesignController from '@/actions/App/Http/Controllers/DesignController';
import { create, edit, index } from '@/routes/designs';

type PaginatedDesigns = {
    data: Design[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    designs: PaginatedDesigns;
};

export default function DesignsIndex({ designs }: Props) {
    const { status } = usePage().props as { status?: string };
    const [designToDelete, setDesignToDelete] = useState<Design | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = () => {
        if (!designToDelete) return;
        setIsDeleting(true);
        router.delete(DesignController.destroy(designToDelete).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setDesignToDelete(null);
            },
        });
    };

    const formatNumber = (value: number | null) =>
        value != null ? Number(value).toFixed(2) : '—';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Diseños', href: index().url },
            ] as BreadcrumbItem[]}
        >
            <Head title="Diseños" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title="Diseños"
                        description="Gestiona los diseños de mezcla por tipo de concreto"
                    />
                    <Button asChild>
                        <Link href={create().url}>
                            <Plus className="mr-2 size-4" />
                            Nuevo diseño
                        </Link>
                    </Button>
                </div>

                {status && (
                    <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                        {status}
                    </div>
                )}

                {designs.data.length === 0 ? (
                    <EmptyState
                        icon={BookOpen}
                        title="No hay diseños"
                        description="Aún no has registrado ningún diseño. Crea el primero para comenzar."
                        action={
                            <Button asChild>
                                <Link href={create().url}>
                                    <Plus className="mr-2 size-4" />
                                    Nuevo diseño
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
                                        <th className="p-3 font-medium">Tipo de concreto</th>
                                        <th className="p-3 font-medium">Agregado</th>
                                        <th className="p-3 font-medium">Revenimiento</th>
                                        <th className="p-3 font-medium">fc</th>
                                        <th className="p-3 font-medium">Cemento</th>
                                        <th className="p-3 font-medium">Arena</th>
                                        <th className="p-3 font-medium">Grava</th>
                                        <th className="p-3 font-medium">Agua</th>
                                        <th className="p-3 text-right font-medium">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {designs.data.map((design) => (
                                        <tr
                                            key={design.id}
                                            className="border-b border-sidebar-border/50 hover:bg-muted/30"
                                        >
                                            <td className="p-3">
                                                {design.concrete_type
                                                    ? `${design.concrete_type.type}${design.concrete_type.concept ? ` - ${design.concrete_type.concept}` : ''}`
                                                    : '—'}
                                            </td>
                                            <td className="p-3">{design.added != null ? design.added : '—'}</td>
                                            <td className="p-3">{design.slump != null ? design.slump : '—'}</td>
                                            <td className="p-3">{design.fc != null ? design.fc : '—'}</td>
                                            <td className="p-3">{formatNumber(design.cement)}</td>
                                            <td className="p-3">{formatNumber(design.sand)}</td>
                                            <td className="p-3">{formatNumber(design.gravel)}</td>
                                            <td className="p-3">{formatNumber(design.water)}</td>
                                            <td className="flex justify-end gap-2 p-3">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={edit(design).url}>
                                                        <Pencil className="size-4" />
                                                        <span className="sr-only">Editar</span>
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => setDesignToDelete(design)}
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

                        {designs.last_page > 1 && (
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {designs.links.map((link, i) => (
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
                    open={!!designToDelete}
                    onOpenChange={(open) => !open && setDesignToDelete(null)}
                    title="¿Eliminar diseño?"
                    description="Se eliminará el diseño y sus datos. Esta acción no se puede deshacer."
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
