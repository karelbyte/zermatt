import { Form, Head, router, usePage } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { MoistureAbsorptionSetting } from '@/types';
import { dashboard } from '@/routes';
import { edit, update } from '@/routes/moisture-absorption';

type Props = {
    setting: MoistureAbsorptionSetting | null;
};

export default function MoistureAbsorptionEdit({ setting }: Props) {
    const { status } = usePage().props as { status?: string };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            router.visit(dashboard.url());
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Humedad y absorción', href: edit().url },
            ] as BreadcrumbItem[]}
        >
            <Head title="Humedad y absorción" />

            <Dialog open onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Humedad y absorción</DialogTitle>
                        <DialogDescription>
                            Configura los valores de humedad y absorción para grava y arena. Solo puede haber un registro; se actualizará al guardar.
                        </DialogDescription>
                    </DialogHeader>

                    {status && (
                        <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
                            {status}
                        </div>
                    )}

                    <Form
                        action={update.url()}
                        method="put"
                        className="space-y-4"
                        onSuccess={() => router.visit(dashboard.url())}
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="humidity_gravel">Humedad grava</Label>
                                    <Input
                                        id="humidity_gravel"
                                        name="humidity_gravel"
                                        type="number"
                                        step="any"
                                        min="0"
                                        placeholder="0"
                                        defaultValue={setting?.humidity_gravel ?? ''}
                                    />
                                    <InputError message={errors.humidity_gravel} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="humidity_sand">Humedad arena</Label>
                                    <Input
                                        id="humidity_sand"
                                        name="humidity_sand"
                                        type="number"
                                        step="any"
                                        min="0"
                                        placeholder="0"
                                        defaultValue={setting?.humidity_sand ?? ''}
                                    />
                                    <InputError message={errors.humidity_sand} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="absorption_gravel">Absorción grava</Label>
                                    <Input
                                        id="absorption_gravel"
                                        name="absorption_gravel"
                                        type="number"
                                        step="any"
                                        min="0"
                                        placeholder="0"
                                        defaultValue={setting?.absorption_gravel ?? ''}
                                    />
                                    <InputError message={errors.absorption_gravel} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="absorption_sand">Absorción arena</Label>
                                    <Input
                                        id="absorption_sand"
                                        name="absorption_sand"
                                        type="number"
                                        step="any"
                                        min="0"
                                        placeholder="0"
                                        defaultValue={setting?.absorption_sand ?? ''}
                                    />
                                    <InputError message={errors.absorption_sand} />
                                </div>

                                <DialogFooter className="gap-3 sm:gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleOpenChange(false)}
                                        disabled={processing}
                                    >
                                        Cerrar
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Guardar
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
