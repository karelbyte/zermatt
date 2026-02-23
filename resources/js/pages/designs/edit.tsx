import { Form, Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Design, ConcreteTypeOption } from '@/types';
import DesignController from '@/actions/App/Http/Controllers/DesignController';
import { edit, index } from '@/routes/designs';

type Props = {
    design: Design;
    concreteTypes: ConcreteTypeOption[];
};

export default function DesignsEdit({ design, concreteTypes }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Diseños', href: index().url },
        {
            title: design.concrete_type ? `${design.concrete_type.type} #${design.id}` : `Diseño #${design.id}`,
            href: edit(design).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar diseño ${design.id}`} />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Editar diseño"
                    description="Modifica los datos del diseño de mezcla"
                />

                <Form
                    action={DesignController.update.url({ design: design.id })}
                    method="put"
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="concrete_type_id">Tipo de concreto</Label>
                                <select
                                    id="concrete_type_id"
                                    name="concrete_type_id"
                                    required
                                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm"
                                    defaultValue={design.concrete_type_id}
                                >
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
                                    defaultValue={design.added ?? ''}
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
                                    defaultValue={design.slump ?? ''}
                                    placeholder="Revenimiento"
                                />
                                <InputError message={errors.slump} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="fc">fc</Label>
                                <Input
                                    id="fc"
                                    name="fc"
                                    type="number"
                                    min="0"
                                    step="1"
                                    defaultValue={design.fc ?? ''}
                                    placeholder="fc "
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
                                    defaultValue={design.cement ?? ''}
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
                                    defaultValue={design.sand ?? ''}
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
                                    defaultValue={design.gravel ?? ''}
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
                                    defaultValue={design.water ?? ''}
                                    placeholder="Agua "
                                />
                                <InputError message={errors.water} />
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
