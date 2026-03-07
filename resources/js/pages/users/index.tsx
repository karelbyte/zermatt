import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '@/components/confirm-modal';
import { EmptyState } from '@/components/empty-state';
import Heading from '@/components/heading';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { User } from '@/types/auth';
import UserController from '@/actions/App/Http/Controllers/UserController';
import { create, edit, index } from '@/routes/users';

type PaginatedUsers = {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    users: PaginatedUsers;
};

export default function UsersIndex({ users }: Props) {
    const { status } = usePage().props as { status?: string };
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        router.delete(UserController.destroy(userToDelete).url, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setUserToDelete(null);
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Usuarios', href: index().url },
            ] as BreadcrumbItem[]}
        >
            <Head title="Usuarios" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title="Usuarios"
                        description="Gestiona los usuarios de la aplicación"
                    />
                    <Button asChild>
                        <Link href={create().url}>
                            <Plus className="mr-2 size-4" />
                            Nuevo usuario
                        </Link>
                    </Button>
                </div>

                {status && (
                    <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
                        {status}
                    </div>
                )}

                {users.data.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="No hay usuarios"
                        description="Aún no hay usuarios registrados. Crea el primero para comenzar."
                        action={
                            <Button asChild>
                                <Link href={create().url}>
                                    <Plus className="mr-2 size-4" />
                                    Nuevo usuario
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
                                        <th className="p-3 font-medium">Correo</th>
                                        <th className="p-3 font-medium">Activo</th>
                                        <th className="p-3 text-right font-medium">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b border-sidebar-border/50 hover:bg-muted/30"
                                        >
                                            <td className="p-3">{user.name}</td>
                                            <td className="p-3">{user.email}</td>
                                            <td className="p-3">
                                                {user.is_active ? 'Activo' : 'Inactivo'}
                                            </td>
                                            <td className="flex justify-end gap-2 p-3">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={edit(user).url}>
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
                                                    onClick={() => setUserToDelete(user)}
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

                        {users.last_page > 1 && (
                            <Pagination links={users.links} className="mt-6" />
                        )}
                    </>
                )}

                <ConfirmModal
                    open={!!userToDelete}
                    onOpenChange={(open) => !open && setUserToDelete(null)}
                    title="¿Eliminar usuario?"
                    description="Se eliminará el usuario y sus datos. Esta acción no se puede deshacer."
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
