import { Form, Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import ConcreteTypeController from '@/actions/App/Http/Controllers/ConcreteTypeController';
import { index } from '@/routes/concrete-types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tipos de concreto', href: index().url },
    { title: 'Nuevo tipo', href: '#' },
];

export default function ConcreteTypesCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo tipo de concreto" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Nuevo tipo de concreto"
                    description="Registra un nuevo tipo de concreto"
                />

                <Form
                    action={ConcreteTypeController.store.url()}
                    method="post"
                    className="space-y-6"
                    resetOnSuccess
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="type">Tipo</Label>
                                <Input
                                    id="type"
                                    name="type"
                                    required
                                    maxLength={5}
                                    placeholder="Ej. A1, B2 (máx. 5 caracteres)"
                                />
                                <InputError message={errors.type} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="concept">Concepto</Label>
                                <Input
                                    id="concept"
                                    name="concept"
                                    maxLength={20}
                                    placeholder="Concepto "
                                />
                                <InputError message={errors.concept} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Input
                                    id="description"
                                    name="description"
                                    maxLength={30}
                                    placeholder="Descripción "
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="hidden"
                                    name="active"
                                    value="0"
                                />
                                <Checkbox
                                    id="active"
                                    name="active"
                                    value="1"
                                    defaultChecked
                                />
                                <Label htmlFor="active">Activo</Label>
                            </div>
                            <InputError message={errors.active} />

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    Crear tipo
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
