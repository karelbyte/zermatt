import { Head, Link, useForm } from '@inertiajs/react';
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

export default function RemissionsEdit({ remission, ...dropdowns }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Remisiones', href: index().url },
        { title: `Remisión #${remission.id}`, href: edit(remission).url },
    ];

    const { data, setData, put, processing, errors } = useForm({
        order_number: remission.order_number ?? '',
        remision: remission.remision ?? '',
        client_id: remission.client_id ?? '',
        work_id: remission.work_id ?? '',
        usage_id: remission.usage_id ?? '',
        fc: remission.fc ?? '',
        design_id: '',
        concrete_type_id: remission.concrete_type_id ?? '',
        concept: remission.concept ?? '',
        added: remission.added ?? '',
        slump: remission.slump ?? '',
        pump: !!remission.pump,
        impermeable: !!remission.impermeable,
        fiber: !!remission.fiber,
        quantity: remission.quantity != null ? String(remission.quantity) : '',
        total_quantity: remission.total_quantity != null ? String(remission.total_quantity) : '',
        pending_delivery: remission.pending_delivery != null ? String(remission.pending_delivery) : '',
        specification: remission.specification ?? '',
        product: remission.product ?? '',
        observations: remission.observations ?? '',
        departure_date: remission.departure_date ?? '',
        pot_id: remission.pot_id ?? '',
        operator_id: remission.operator_id ?? '',
        cement_amount: remission.cement_amount ?? '',
        additive_amount: remission.additive_amount != null ? String(remission.additive_amount) : '',
        fiber_amount: remission.fiber_amount != null ? String(remission.fiber_amount) : '',
        waterproofing_amount: remission.waterproofing_amount != null ? String(remission.waterproofing_amount) : '',
        gravel: remission.gravel != null ? String(remission.gravel) : '',
        sand: remission.sand != null ? String(remission.sand) : '',
        water: remission.water != null ? String(remission.water) : '',
        invoice: remission.invoice ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(RemissionController.update.url({ remission: remission.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar remisión #${remission.id}`} />

            <div className="space-y-6">
                <h1 className="text-xl font-semibold">Editar remisión</h1>

                <form onSubmit={submit} className="space-y-6">
                    <RemissionFormFields {...dropdowns} data={data} setData={setData} errors={errors} />

                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>
                            Guardar cambios
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={index().url}>Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
