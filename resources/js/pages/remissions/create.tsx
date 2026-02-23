import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { RemissionFormFields } from '@/components/remission-form-fields';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { RemissionDropdowns } from '@/types';
import RemissionController from '@/actions/App/Http/Controllers/RemissionController';
import { index } from '@/routes/remissions';

type Props = RemissionDropdowns;

export default function RemissionsCreate(props: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Remisiones', href: index().url },
        { title: 'Nueva remisión', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva remisión" />

            <div className="space-y-6">
                <h1 className="text-xl font-semibold">Nueva remisión</h1>

                <Form
                    action={RemissionController.store.url()}
                    method="post"
                    className="space-y-6"
                    resetOnSuccess
                >
                    {({ processing, errors }) => (
                        <>
                            <RemissionFormFields {...props} errors={errors} />
                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    Crear remisión
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
