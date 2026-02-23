import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { RemissionFormFields } from '@/components/remission-form-fields';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Remission, RemissionDropdowns } from '@/types';
import RemissionController from '@/actions/App/Http/Controllers/RemissionController';
import { edit, index } from '@/routes/remissions';

type Props = RemissionDropdowns & {
    remission: Remission;
};

function dateInputValue(date: string | null): string {
    if (!date) return '';
    try {
        return new Date(date).toISOString().slice(0, 10);
    } catch {
        return '';
    }
}

export default function RemissionsEdit({ remission, ...dropdowns }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Remisiones', href: index().url },
        { title: `Remisión #${remission.id}`, href: edit(remission).url },
    ];

    const defaultValues = {
        order_number: remission.order_number ?? undefined,
        client_id: remission.client_id,
        work_id: remission.work_id,
        usage_id: remission.usage_id ?? undefined,
        fc: remission.fc ?? undefined,
        concrete_type_id: remission.concrete_type_id ?? undefined,
        concept: remission.concept ?? '',
        added: remission.added ?? undefined,
        slump: remission.slump ?? undefined,
        pump: remission.pump,
        impermeable: remission.impermeable,
        fiber: remission.fiber,
        quantity: remission.quantity != null ? String(remission.quantity) : '',
        specification: remission.specification ?? '',
        product: remission.product ?? '',
        observations: remission.observations ?? '',
        departure_date: dateInputValue(remission.departure_date),
        pot_id: remission.pot_id ?? undefined,
        operator_id: remission.operator_id ?? undefined,
        cement_amount: remission.cement_amount ?? undefined,
        additive_amount: remission.additive_amount != null ? String(remission.additive_amount) : '',
        fiber_amount: remission.fiber_amount != null ? String(remission.fiber_amount) : '',
        gravel: remission.gravel != null ? String(remission.gravel) : '',
        sand: remission.sand != null ? String(remission.sand) : '',
        water: remission.water != null ? String(remission.water) : '',
        tp: remission.tp ?? '',
        invoice: remission.invoice ?? '',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar remisión #${remission.id}`} />

            <div className="space-y-6">
                <h1 className="text-xl font-semibold">Editar remisión</h1>

                <Form
                    action={RemissionController.update.url({ remission: remission.id })}
                    method="put"
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <RemissionFormFields {...dropdowns} errors={errors} defaultValues={defaultValues} />
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
