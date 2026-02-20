import { Form } from '@inertiajs/react';
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
import type { MoistureAbsorptionSetting } from '@/types';
import { update } from '@/routes/moisture-absorption';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setting: MoistureAbsorptionSetting | null;
};

export function MoistureAbsorptionModal({
    open,
    onOpenChange,
    setting,
}: Props) {
    const handleSuccess = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Humedad y absorción</DialogTitle>
                    <DialogDescription>
                        Configura los valores de humedad y absorción para grava y arena. Solo puede haber un registro; se actualizará al guardar.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    action={update.url()}
                    method="put"
                    className="space-y-4"
                    onSuccess={handleSuccess}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="moisture-humidity_gravel">Humedad grava</Label>
                                <Input
                                    id="moisture-humidity_gravel"
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
                                <Label htmlFor="moisture-humidity_sand">Humedad arena</Label>
                                <Input
                                    id="moisture-humidity_sand"
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
                                <Label htmlFor="moisture-absorption_gravel">Absorción grava</Label>
                                <Input
                                    id="moisture-absorption_gravel"
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
                                <Label htmlFor="moisture-absorption_sand">Absorción arena</Label>
                                <Input
                                    id="moisture-absorption_sand"
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
                                    onClick={() => onOpenChange(false)}
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
    );
}
