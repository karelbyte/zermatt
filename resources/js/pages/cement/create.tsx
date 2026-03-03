import { Form, Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import CementController from '@/actions/App/Http/Controllers/CementController';
import { index } from '@/routes/cements';

type Props = {
    suppliers: { id: number; name: string }[];
};

export default function CementCreate({ suppliers }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Cemento', href: index().url },
        { title: 'Nuevo registro', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo registro de cemento" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Nuevo registro de cemento"
                    description="Registra una entrada de cemento (fecha, kilogramos y opcionalmente proveedor)"
                />

                <Form
                    action={CementController.store.url()}
                    method="post"
                    className="space-y-6"
                    resetOnSuccess
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="date">Fecha</Label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm"
                                />
                                <InputError message={errors.date} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tons">Kilogramos</Label>
                                <Input
                                    id="tons"
                                    name="tons"
                                    type="number"
                                    step="any"
                                    min="0"
                                    placeholder="Kilogramos"
                                />
                                <InputError message={errors.tons} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="supplier_id">Proveedor </Label>
                                <select
                                    id="supplier_id"
                                    name="supplier_id"
                                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm"
                                >
                                    <option value="">Sin proveedor</option>
                                    {suppliers.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.supplier_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="document">Nota o remision </Label>
                                <Input
                                    id="document"
                                    name="document"
                                    maxLength={255}
                                    placeholder="Nota o remision"
                                />
                                <InputError message={errors.document} />
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    Crear registro
                                </Button>
                                <Button
                                    type="submit"
                                    name="status"
                                    value="closed"
                                    variant="secondary"
                                    disabled={processing}
                                >
                                    Guardar y cerrar
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={index().url}>Cancelar</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
