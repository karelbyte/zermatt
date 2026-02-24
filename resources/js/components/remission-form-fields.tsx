import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RemissionDropdowns } from '@/types';

const selectClass =
    'border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm';

type Props = RemissionDropdowns & {
    errors: Record<string, string | undefined>;
    defaultValues?: Partial<{
        order_number: number | null;
        client_id: number;
        work_id: number;
        usage_id: number | null;
        fc: number | null;
        concrete_type_id: number | null;
        concept: string;
        added: number | null;
        slump: number | null;
        pump: boolean;
        impermeable: boolean;
        fiber: boolean;
        quantity: string;
        specification: string;
        product: string;
        observations: string;
        departure_date: string;
        pot_id: number | null;
        operator_id: number | null;
        cement_amount: number | null;
        additive_amount: string;
        fiber_amount: string;
        gravel: string;
        sand: string;
        water: string;
        tp: string;
        invoice: string;
    }>;
};

export function RemissionFormFields({
    clients,
    works,
    usages,
    concreteTypes,
    pots,
    operators,
    designs,
    errors,
    defaultValues = {},
}: Props) {
    const d = defaultValues;

    return (
        <div className="space-y-8">
            <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Datos generales</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="grid gap-2">
                        <Label htmlFor="order_number">Pedido</Label>
                        <Input id="order_number" name="order_number" type="number" min={0} defaultValue={d.order_number ?? ''} />
                        <InputError message={errors.order_number} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="client_id">Cliente *</Label>
                        <select id="client_id" name="client_id" required className={selectClass} defaultValue={d.client_id ?? ''}>
                            <option value="">Seleccione cliente</option>
                            {clients.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.client_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="work_id">Obra *</Label>
                        <select id="work_id" name="work_id" required className={selectClass} defaultValue={d.work_id ?? ''}>
                            <option value="">Seleccione obra</option>
                            {works.map((w) => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.work_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="usage_id">Uso</Label>
                        <select id="usage_id" name="usage_id" className={selectClass} defaultValue={d.usage_id ?? ''}>
                            <option value="">Seleccione uso</option>
                            {usages.map((u) => (
                                <option key={u.id} value={u.id}>{u.description}</option>
                            ))}
                        </select>
                        <InputError message={errors.usage_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="departure_date">Hora de salida</Label>
                        <Input
                            id="departure_date"
                            name="departure_date"
                            type="time"
                            className={selectClass}
                            defaultValue={d.departure_date ?? ''}
                        />
                        <InputError message={errors.departure_date} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="invoice">Factura</Label>
                        <Input id="invoice" name="invoice" maxLength={255} defaultValue={d.invoice} />
                        <InputError message={errors.invoice} />
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Concreto</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="grid gap-2">
                        <Label htmlFor="fc">Fc</Label>
                        <select id="fc" name="fc" className={selectClass} defaultValue={d.fc ?? ''}>
                            <option value="">Seleccione Fc</option>
                            {designs.map((design) => (
                                <option key={design.id} value={design.fc ?? ''}>
                                    Fc: {design.fc} - {(design.concrete_type as any)?.type} - {design.added}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.fc} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="concrete_type_id">Tipo de concreto</Label>
                        <select id="concrete_type_id" name="concrete_type_id" className={selectClass} defaultValue={d.concrete_type_id ?? ''}>
                            <option value="">Seleccione</option>
                            {concreteTypes.map((ct) => (
                                <option key={ct.id} value={ct.id}>{ct.type}{ct.concept ? ` - ${ct.concept}` : ''}</option>
                            ))}
                        </select>
                        <InputError message={errors.concrete_type_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="concept">Concepto</Label>
                        <Input id="concept" name="concept" maxLength={255} defaultValue={d.concept} />
                        <InputError message={errors.concept} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="added">Añadido</Label>
                        <Input id="added" name="added" type="number" min={0} defaultValue={d.added ?? ''} />
                        <InputError message={errors.added} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="slump">Revenimiento</Label>
                        <Input id="slump" name="slump" type="number" min={0} defaultValue={d.slump ?? ''} />
                        <InputError message={errors.slump} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="quantity">Cantidad</Label>
                        <Input id="quantity" name="quantity" type="number" step="0.01" min={0} defaultValue={d.quantity} />
                        <InputError message={errors.quantity} />
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Opciones</h3>
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <input type="hidden" name="pump" value="0" />
                        <Checkbox id="pump" name="pump" value="1" defaultChecked={d.pump} />
                        <Label htmlFor="pump">Bomba</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="hidden" name="impermeable" value="0" />
                        <Checkbox id="impermeable" name="impermeable" value="1" defaultChecked={d.impermeable} />
                        <Label htmlFor="impermeable">Imper</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="hidden" name="fiber" value="0" />
                        <Checkbox id="fiber" name="fiber" value="1" defaultChecked={d.fiber} />
                        <Label htmlFor="fiber">Fibra</Label>
                    </div>
                </div>
                <InputError message={errors.pump} />
                <InputError message={errors.impermeable} />
                <InputError message={errors.fiber} />
            </section>

            <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Especificación y producto</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="grid gap-2">
                        <Label htmlFor="specification">Especificación</Label>
                        <Input id="specification" name="specification" maxLength={500} defaultValue={d.specification} />
                        <InputError message={errors.specification} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="product">Producto</Label>
                        <Input id="product" name="product" maxLength={255} defaultValue={d.product} />
                        <InputError message={errors.product} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="observations">Observaciones</Label>
                        <textarea
                            id="observations"
                            name="observations"
                            rows={3}
                            maxLength={2000}
                            className={selectClass}
                            defaultValue={d.observations}
                        />
                        <InputError message={errors.observations} />
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Olla y operador</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="grid gap-2">
                        <Label htmlFor="pot_id">Olla</Label>
                        <select id="pot_id" name="pot_id" className={selectClass} defaultValue={d.pot_id ?? ''}>
                            <option value="">Seleccione</option>
                            {pots.map((p) => (
                                <option key={p.id} value={p.id}>{p.number}</option>
                            ))}
                        </select>
                        <InputError message={errors.pot_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="operator_id">Operador</Label>
                        <select id="operator_id" name="operator_id" className={selectClass} defaultValue={d.operator_id ?? ''}>
                            <option value="">Seleccione</option>
                            {operators.map((op) => (
                                <option key={op.id} value={op.id}>{op.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.operator_id} />
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Cantidades (materiales)</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="grid gap-2">
                        <Label htmlFor="cement_amount">Cemento</Label>
                        <Input id="cement_amount" name="cement_amount" type="number" min={0} defaultValue={d.cement_amount ?? ''} />
                        <InputError message={errors.cement_amount} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="additive_amount">Aditivo</Label>
                        <Input id="additive_amount" name="additive_amount" type="number" step="0.01" min={0} defaultValue={d.additive_amount} />
                        <InputError message={errors.additive_amount} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="fiber_amount">Fibra (cant.)</Label>
                        <Input id="fiber_amount" name="fiber_amount" type="number" step="0.01" min={0} defaultValue={d.fiber_amount} />
                        <InputError message={errors.fiber_amount} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="gravel">Grava</Label>
                        <Input id="gravel" name="gravel" type="number" step="0.01" min={0} defaultValue={d.gravel} />
                        <InputError message={errors.gravel} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="sand">Arena</Label>
                        <Input id="sand" name="sand" type="number" step="0.01" min={0} defaultValue={d.sand} />
                        <InputError message={errors.sand} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="water">Agua</Label>
                        <Input id="water" name="water" type="number" step="0.01" min={0} defaultValue={d.water} />
                        <InputError message={errors.water} />
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Otros</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="tp">TP</Label>
                        <Input id="tp" name="tp" maxLength={100} defaultValue={d.tp} />
                        <InputError message={errors.tp} />
                    </div>
                </div>
            </section>
        </div>
    );
}
