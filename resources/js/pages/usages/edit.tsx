import { Form, Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Usage } from '@/types';
import UsageController from '@/actions/App/Http/Controllers/UsageController';
import { edit, index } from '@/routes/usages';

type Props = {
    usage: Usage;
};

export default function UsagesEdit({ usage }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Usos', href: index().url },
        { title: usage.description, href: edit(usage).url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar uso: ${usage.description}`} />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Editar uso"
                    description="Modifica la descripción del uso"
                />

                <Form
                    action={UsageController.update.url({ usage: usage.id })}
                    method="put"
                    className="space-y-6"
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
                                    defaultValue={usage.description}
                                    placeholder="Descripción del uso"
                                />
                                <InputError message={errors.description} />
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
