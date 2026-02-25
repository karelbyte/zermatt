import { Head, Link, useForm } from '@inertiajs/react';
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

    const { data, setData, post, processing, errors } = useForm({
        order_number: '',
        client_id: '',
        work_id: '',
        usage_id: '',
        fc: '',
        concrete_type_id: '',
        concept: '',
        added: '',
        slump: '',
        pump: false,
        impermeable: false,
        fiber: false,
        quantity: '',
        specification: '',
        product: '',
        observations: '',
        departure_date: '',
        pot_id: '',
        operator_id: '',
        cement_amount: '',
        additive_amount: '',
        fiber_amount: '',
        gravel: '',
        sand: '',
        water: '',
        tp: '',
        invoice: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(RemissionController.store.url());
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva remisión" />

            <div className="space-y-6">
                <h1 className="text-xl font-semibold">Nueva remisión</h1>

                <form onSubmit={submit} className="space-y-6">
                    <RemissionFormFields {...props} data={data} setData={setData} errors={errors} />

                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>
                            Crear remisión
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
