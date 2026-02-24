import { Form, Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Additive } from '@/types';
import AdditiveController from '@/actions/App/Http/Controllers/AdditiveController';
import { edit, index } from '@/routes/additives';

type Props = {
    additive: Additive;
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

export default function AdditivesEdit({ additive, suppliers }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Aditivos', href: index().url },
        { title: 'Editar registro', href: edit(additive).url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar registro de aditivo" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Editar registro de aditivo"
                    description="Modifica fecha, toneladas, documento o proveedor"
                />

                <Form
                    action={AdditiveController.update.url({ additive: additive.id })}
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
                                    defaultValue={dateInputValue(additive.date)}
                                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm"
                                />
                                <InputError message={errors.date} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tons">Cantidad</Label>
                                <Input
                                    id="tons"
                                    name="tons"
                                    type="number"
                                    step="any"
                                    min="0"
                                    defaultValue={additive.tons ?? ''}
                                    placeholder="Ejemplo: 100"
                                />
                                <InputError message={errors.tons} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="supplier_id">Proveedor </Label>
                                <select
                                    id="supplier_id"
                                    name="supplier_id"
                                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm"
                                    defaultValue={additive.supplier_id ?? ''}
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
                                    defaultValue={additive.document ?? ''}
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
