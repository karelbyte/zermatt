import { Form, Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import UsageController from '@/actions/App/Http/Controllers/UsageController';
import { index } from '@/routes/usages';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usos', href: index().url },
    { title: 'Nuevo uso', href: '#' },
];

export default function UsagesCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo uso" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Nuevo uso"
                    description="Registra un nuevo uso en el catálogo"
                />

                <Form
                    action={UsageController.store.url()}
                    method="post"
                    className="space-y-6"
                    resetOnSuccess
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Input
                                    id="description"
                                    name="description"
                                    required
                                    maxLength={255}
                                    placeholder="Descripción del uso"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    Crear uso
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
