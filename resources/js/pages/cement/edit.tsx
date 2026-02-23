import { Form, Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Cement } from '@/types';
import CementController from '@/actions/App/Http/Controllers/CementController';
import { edit, index } from '@/routes/cements';

type Props = {
    cement: Cement;
    suppliers: { id: number; name: string }[];
};

function dateInputValue(date: string | null): string {
    if (!date) return '';
    try {
        const d = new Date(date);
        return d.toISOString().slice(0, 10);
    } catch {
        return '';
    }
}

export default function CementEdit({ cement, suppliers }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Cemento', href: index().url },
        { title: 'Editar registro', href: edit(cement).url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar registro de cemento" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Editar registro de cemento"
                    description="Modifica fecha, toneladas o proveedor"
                />

                <Form
                    action={CementController.update.url({ cement: cement.id })}
                    method="put"
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="date">Fecha</Label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    defaultValue={dateInputValue(cement.date)}
                                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm"
                                />
                                <InputError message={errors.date} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tons">Toneladas</Label>
                                <Input
                                    id="tons"
                                    name="tons"
                                    type="number"
                                    step="any"
                                    min="0"
                                    defaultValue={cement.tons ?? ''}
                                    placeholder="Toneladas"
                                />
                                <InputError message={errors.tons} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="supplier_id">Proveedor </Label>
                                <select
                                    id="supplier_id"
                                    name="supplier_id"
                                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm"
                                    defaultValue={cement.supplier_id ?? ''}
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
                                <Label htmlFor="document">Documento </Label>
                                <Input
                                    id="document"
                                    name="document"
                                    maxLength={255}
                                    defaultValue={cement.document ?? ''}
                                    placeholder="Documento"
                                />
                                <InputError message={errors.document} />
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    Guardar cambios
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
