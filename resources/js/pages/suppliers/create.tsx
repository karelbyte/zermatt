import { Form, Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import SupplierController from '@/actions/App/Http/Controllers/SupplierController';
import { index } from '@/routes/suppliers';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Proveedores', href: index().url },
    { title: 'Nuevo proveedor', href: '#' },
];

export default function SuppliersCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo proveedor" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Nuevo proveedor"
                    description="Crea un nuevo proveedor en la aplicación"
                />

                <Form
                    action={SupplierController.store.url()}
                    method="post"
                    className="space-y-6"
                    resetOnSuccess
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    autoComplete="organization"
                                    placeholder="Nombre o razón social"
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
                                    placeholder="Dirección fiscal"
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
                                    placeholder="Teléfono de contacto"
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="rfc">RFC</Label>
                                <Input
                                    id="rfc"
                                    name="rfc"
                                    placeholder="RFC (opcional)"
                                />
                                <InputError message={errors.rfc} />
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    Crear proveedor
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
