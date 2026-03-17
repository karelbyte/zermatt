import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { RemissionFormFields } from '@/components/remission-form-fields';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { RemissionDropdowns } from '@/types';
import RemissionController from '@/actions/App/Http/Controllers/RemissionController';
import { index } from '@/routes/remissions';
import { useEffect } from 'react';

type Props = RemissionDropdowns;

export default function RemissionsCreate(props: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Remisiones', href: index().url },
        { title: 'Nueva remisión', href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        order_number: props.suggested_order_number != null ? String(props.suggested_order_number) : '',
        remision: '',
        client_id: '',
        work_id: '',
        usage_id: '',
        fc: '',
        design_id: '',
        concrete_type_id: '',
        concept: '',
        added: '',
        slump: '',
        pump: false,
        impermeable: false,
        fiber: false,
        quantity: '',
        total_quantity: '',
        pending_delivery: '',
        specification: '',
        product: '',
        observations: '',
        departure_date: '',
        pot_id: '',
        operator_id: '',
        cement_amount: '',
        additive_amount: '',
        fiber_amount: '',
        waterproofing_amount: '',
        gravel: '',
        sand: '',
        water: '',
        invoice: '',
    });

    // If there is a previous remission with pending delivery for the same client + concrete type + fc,
    // prefill total_quantity with the remaining amount (only if the user hasn't entered one yet).
    useEffect(() => {
        const clientId = String(data.client_id || '');
        const concreteTypeId = String(data.concrete_type_id || '');
        const fc = String(data.fc || '');

        if (!clientId || !concreteTypeId || !fc) return;
        if (String(data.total_quantity || '')) return;

        const controller = new AbortController();
        fetch(`/remissions/pending?client_id=${encodeURIComponent(clientId)}&concrete_type_id=${encodeURIComponent(concreteTypeId)}&fc=${encodeURIComponent(fc)}`, {
            signal: controller.signal,
            headers: { 'Accept': 'application/json' },
            credentials: 'same-origin',
        })
            .then((r) => (r.ok ? r.json() : null))
            .then((json) => {
                const pending = json?.pending != null ? Number(json.pending) : 0;
                if (pending > 0) {
                    setData('total_quantity', pending.toFixed(2));
                    setData('quantity', '');
                }
            })
            .catch(() => {
                // ignore
            });

        return () => controller.abort();
    }, [data.client_id, data.concrete_type_id, data.fc]);

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
