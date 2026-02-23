import { Form, Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Pot } from '@/types';
import PotController from '@/actions/App/Http/Controllers/PotController';
import { edit, index } from '@/routes/pots';

type Props = {
    pot: Pot;
};

export default function PotsEdit({ pot }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Ollas', href: index().url },
        { title: `Olla ${pot.number}`, href: edit(pot).url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar olla ${pot.number}`} />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Editar olla"
                    description="Modifica los datos de la olla"
                />

                <Form
                    action={PotController.update.url({ pot: pot.id })}
                    method="put"
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="number">Número</Label>
                                <Input
                                    id="number"
                                    name="number"
                                    required
                                    maxLength={10}
                                    defaultValue={pot.number}
                                    placeholder="Ej. 1, 2, A1"
                                />
                                <InputError message={errors.number} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="capacity">Capacidad</Label>
                                <Input
                                    id="capacity"
                                    name="capacity"
                                    type="number"
                                    step="any"
                                    min="0"
                                    defaultValue={
                                        pot.capacity ?? ''
                                    }
                                    placeholder="Capacidad "
                                />
                                <InputError message={errors.capacity} />
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
                                    defaultChecked={pot.active}
                                />
                                <Label htmlFor="active">Activa</Label>
                            </div>
                            <InputError message={errors.active} />

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
