import { Head, router } from '@inertiajs/react';
import { Search, FileText, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { EmptyState } from '@/components/empty-state';
import Heading from '@/components/heading';
import { Pagination } from '@/components/pagination';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { JsonViewer } from '@/components/json-viewer';
import { useRef } from 'react';

type ActivityLog = {
    id: number;
    user_id: number | null;
    model_type: string;
    model_id: number | null;
    action: string;
    description: string | null;
    old_values: Record<string, any> | null;
    new_values: Record<string, any> | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    } | null;
    model_name: string;
    action_name: string;
};

type PaginatedLogs = {
    data: ActivityLog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type ModelType = {
    value: string;
    label: string;
};

type Props = {
    logs: PaginatedLogs;
    modelTypes: ModelType[];
    filters: {
        search: string | null;
        action: string | null;
        model_type: string | null;
        user_id: string | null;
    };
};

export default function LogsIndex({ logs, modelTypes, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [action, setAction] = useState(filters.action || 'all');
    const [modelType, setModelType] = useState(filters.model_type || 'all');
    
    const actionNames: Record<string, string> = {
        created: 'Creado',
        updated: 'Actualizado',
        deleted: 'Eliminado',
    };

    useEffect(() => {
        // Only trigger update if local state differs from props (meaning user changed a filter)
        const hasChanged =
            search !== (filters.search || '') ||
            action !== (filters.action || 'all') ||
            modelType !== (filters.model_type || 'all');

        if (!hasChanged) return;

        const timer = setTimeout(() => {
            const params: Record<string, string> = {};
            if (search) params.search = search;
            if (action !== 'all') params.action = action;
            if (modelType !== 'all') params.model_type = modelType;

            router.get('/logs', params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [search, action, modelType, filters]);

    const getActionBadge = (actionValue: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
            created: 'default',
            updated: 'secondary',
            deleted: 'destructive',
        };
        return variants[actionValue] || 'default';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Logs', href: '/logs' }] as BreadcrumbItem[]}
        >
            <Head title="Logs de Actividad" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <Heading
                        variant="small"
                        title="Logs de Actividad"
                        description="Historial de todas las operaciones realizadas en el sistema"
                    />
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar en logs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={action} onValueChange={setAction}>
                                <SelectTrigger className="w-[140px]">
                                    <Filter className="mr-2 size-4" />
                                    <SelectValue placeholder="Acción" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas</SelectItem>
                                    <SelectItem value="created">Creado</SelectItem>
                                    <SelectItem value="updated">Actualizado</SelectItem>
                                    <SelectItem value="deleted">Eliminado</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={modelType} onValueChange={setModelType}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Módulo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los módulos</SelectItem>
                                    {modelTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {logs.data.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title={
                            search || action !== 'all' || modelType !== 'all'
                                ? 'No se encontraron resultados'
                                : 'No hay logs'
                        }
                        description={
                            search || action !== 'all' || modelType !== 'all'
                                ? 'No se encontraron logs con los filtros aplicados'
                                : 'Aún no se han registrado actividades en el sistema'
                        }
                    />
                ) : (
                    <>
                        <div className="rounded-xl border border-sidebar-border/70 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/50">
                                    <tr>
                                        <th className="p-3 font-medium">Fecha</th>
                                        <th className="p-3 font-medium">Usuario</th>
                                        <th className="p-3 font-medium">Acción</th>
                                        <th className="p-3 font-medium">Módulo</th>
                                        <th className="p-3 font-medium">Descripción</th>
                                        <th className="p-3 font-medium">Valor Anterior</th>
                                        <th className="p-3 font-medium">Valor Actual</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.data.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="border-b border-sidebar-border/50 hover:bg-muted/30"
                                        >
                                            <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                                                {formatDate(log.created_at)}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {log.user?.name || 'Sistema'}
                                                    </span>
                                                    {log.user?.email && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {log.user.email}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <Badge variant={getActionBadge(log.action)}>
                                                    {actionNames[log.action] || log.action}
                                                </Badge>
                                            </td>
                                            <td className="p-3">
                                                <span className="text-xs font-medium">
                                                    {log.model_type.split('\\').pop()}
                                                </span>
                                            </td>
                                            <td className="p-3 max-w-md">
                                                <span className="line-clamp-2">
                                                    {log.description || '—'}
                                                </span>
                                            </td>
                                            <td className="p-3 text-xs text-muted-foreground max-w-xs">
                                                {log.old_values ? (
                                                    <JsonViewer data={log.old_values} />
                                                ) : '—'}
                                            </td>
                                            <td className="p-3 text-xs text-muted-foreground max-w-xs">
                                                {log.new_values ? (
                                                    <JsonViewer data={log.new_values} />
                                                ) : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {logs.last_page > 1 && (
                            <Pagination links={logs.links} className="mt-6" />
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
