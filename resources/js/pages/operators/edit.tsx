import { Form, Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Operator } from '@/types';
import OperatorController from '@/actions/App/Http/Controllers/OperatorController';
import { edit, index } from '@/routes/operators';

type Props = {
    operator: Operator;
};

export default function OperatorsEdit({ operator }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Operadores', href: index().url },
        { title: operator.name, href: edit(operator).url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${operator.name}`} />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Editar operador"
                    description="Modifica los datos del operador"
                />

                <Form
                    action={OperatorController.update.url({ operator: operator.id })}
                    method="put"
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    autoComplete="name"
                                    defaultValue={operator.name}
                                    placeholder="Nombre completo"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Dirección</Label>
                                <textarea
                                    id="address"
                                    name="address"
                                    rows={3}
                                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm"
                                    placeholder="Dirección"
                                    defaultValue={operator.address ?? ''}
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    defaultValue={operator.phone ?? ''}
                                    placeholder="Teléfono de contacto"
                                />
                                <InputError message={errors.phone} />
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
