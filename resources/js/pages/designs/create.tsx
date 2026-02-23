import { Form, Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { ConcreteTypeOption } from '@/types';
import DesignController from '@/actions/App/Http/Controllers/DesignController';
import { index } from '@/routes/designs';

type Props = {
    concreteTypes: ConcreteTypeOption[];
};

export default function DesignsCreate({ concreteTypes }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Diseños', href: index().url },
        { title: 'Nuevo diseño', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo diseño" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Nuevo diseño"
                    description="Registra un nuevo diseño de mezcla"
                />

                <Form
                    action={DesignController.store.url()}
                    method="post"
                    className="space-y-6"
                    resetOnSuccess
                >
                    {({ processing, errors }) => (
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="concrete_type_id">Tipo de concreto</Label>
                                <select
                                    id="concrete_type_id"
                                    name="concrete_type_id"
                                    required
                                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm"
                                >
                                    <option value="">Selecciona un tipo de concreto</option>
                                    {concreteTypes.map((ct) => (
                                        <option key={ct.id} value={ct.id}>
                                            {ct.type}
                                            {ct.concept ? ` - ${ct.concept}` : ''}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.concrete_type_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="added">Agregado</Label>
                                <Input
                                    id="added"
                                    name="added"
                                    type="number"
                                    min={0}
                                    step={1}
                                    placeholder="Agregado"
                                />
                                <InputError message={errors.added} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slump">Revenimiento</Label>
                                <Input
                                    id="slump"
                                    name="slump"
                                    type="number"
                                    min={0}
                                    step={1}
                                    placeholder="Revenimiento"
                                />
                                <InputError message={errors.slump} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="fc">Fc</Label>
                                <Input
                                    id="fc"
                                    name="fc"
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder="Fc "
                                />
                                <InputError message={errors.fc} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="cement">Cemento</Label>
                                <Input
                                    id="cement"
                                    name="cement"
                                    type="number"
                                    step="any"
                                    min="0"
                                    placeholder="Cemento "
                                />
                                <InputError message={errors.cement} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="sand">Arena</Label>
                                <Input
                                    id="sand"
                                    name="sand"
                                    type="number"
                                    step="any"
                                    min="0"
                                    placeholder="Arena "
                                />
                                <InputError message={errors.sand} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="gravel">Grava</Label>
                                <Input
                                    id="gravel"
                                    name="gravel"
                                    type="number"
                                    step="any"
                                    min="0"
                                    placeholder="Grava "
                                />
                                <InputError message={errors.gravel} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="water">Agua</Label>
                                <Input
                                    id="water"
                                    name="water"
                                    type="number"
                                    step="any"
                                    min="0"
                                    placeholder="Agua "
                                />
                                <InputError message={errors.water} />
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    Crear diseño
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={index().url}>Cancelar</Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
