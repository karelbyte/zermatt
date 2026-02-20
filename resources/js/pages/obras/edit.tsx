import { Form, Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { ClientOption, Obra } from '@/types';
import ObraController from '@/actions/App/Http/Controllers/ObraController';
import { edit, index } from '@/routes/obras';

type Props = {
    obra: Obra;
    clients: ClientOption[];
};

export default function ObrasEdit({ obra, clients }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Obras', href: index().url },
        { title: obra.name, href: edit(obra).url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${obra.name}`} />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Editar obra"
                    description="Modifica los datos de la obra"
                />

                <Form
                    action={ObraController.update.url({ obra: obra.id })}
                    method="put"
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="client_id">Cliente</Label>
                                <select
                                    id="client_id"
                                    name="client_id"
                                    required
                                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm"
                                    defaultValue={obra.client_id}
                                >
                                    {clients.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.client_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    defaultValue={obra.name}
                                    placeholder="Nombre de la obra"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Descripción</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm"
                                    placeholder="Descripción de la obra"
                                    defaultValue={obra.description ?? ''}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Dirección</Label>
                                <textarea
                                    id="address"
                                    name="address"
                                    rows={2}
                                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm"
                                    placeholder="Dirección de la obra"
                                    defaultValue={obra.address ?? ''}
                                />
                                <InputError message={errors.address} />
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
