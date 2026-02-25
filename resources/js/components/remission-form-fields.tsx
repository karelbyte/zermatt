import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RemissionDropdowns } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

const selectClass =
    'border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm';

type Props = RemissionDropdowns & {
    data: any;
    setData: (key: any, value?: any) => void;
    errors: Record<string, string | undefined>;
};

export function RemissionFormFields({
    clients,
    works,
    usages,
    concreteTypes,
    pots,
    operators,
    designs,
    data,
    setData,
    errors,
}: Props) {
    const { moistureAbsorption } = usePage().props as any;

    useEffect(() => {
        if (!data.fc || !data.quantity) return;

        // Find the design by fc. If multiple, pick the first one for now as per user instruction.
        // Ideally we should use design.id, but the user wants to link by fc.
        const design = designs.find((d) => String(d.fc) === String(data.fc));
        if (!design) return;

        const qty = parseFloat(data.quantity);
        if (isNaN(qty)) return;

        // Base quantities from design
        const baseCement = (design.cement || 0) * qty;
        const baseSand = (design.sand || 0) * qty;
        const baseGravel = (design.gravel || 0) * qty;
        const baseWater = (design.water || 0) * qty;

        // Moisture corrections
        const humiditySand = moistureAbsorption?.humidity_sand || 0;
        const absorptionSand = moistureAbsorption?.absorption_sand || 0;
        const humidityGravel = moistureAbsorption?.humidity_gravel || 0;
        const absorptionGravel = moistureAbsorption?.absorption_gravel || 0;

        // Sand correction
        const sandWaterContrib = (baseSand * (humiditySand - absorptionSand)) / 100;
        const gravelWaterContrib = (baseGravel * (humidityGravel - absorptionGravel)) / 100;

        const finalSand = baseSand * (1 + humiditySand / 100);
        const finalGravel = baseGravel * (1 + humidityGravel / 100);
        const finalWater = baseWater - sandWaterContrib - gravelWaterContrib;
        const finalCement = baseCement;

        setData((d: any) => ({
            ...d,
            cement_amount: finalCement.toFixed(2),
            sand: finalSand.toFixed(2),
            gravel: finalGravel.toFixed(2),
            water: finalWater.toFixed(2),
            // Also sync other design fields if they are empty
            added: d.added || design.added,
            concrete_type_id: d.concrete_type_id || design.concrete_type_id,
        }));
    }, [data.fc, data.quantity, moistureAbsorption, designs, setData]);

    // Pricing calculation logic
    useEffect(() => {
        const qty = parseFloat(data.quantity || '0');
        const price = parseFloat(data.unit_price || '0');
        const taxPercent = parseFloat(data.iva_percentage || '16');

        if (isNaN(qty) || isNaN(price)) return;

        const subtotal = qty * price;
        const iva = subtotal * (taxPercent / 100);
        const total = subtotal + iva;

        // Update local state if different (prevent loops)
        if (
            data.subtotal !== subtotal.toFixed(2) ||
            data.iva !== iva.toFixed(2) ||
            data.total !== total.toFixed(2)
        ) {
            setData((d: any) => ({
                ...d,
                subtotal: subtotal.toFixed(2),
                iva: iva.toFixed(2),
                total: total.toFixed(2),
                iva_percentage: taxPercent,
            }));
        }
    }, [data.quantity, data.unit_price, data.iva_percentage]);

    // Price lookup when design changes
    useEffect(() => {
        if (!data.fc) return;
        const design = designs.find((d) => String(d.fc) === String(data.fc));
        if (!design) return;

        const basePrice = (design as any).concrete_type?.base_price;
        // Only set if unit_price is empty or hasn't been manually set yet (or user just switched design)
        if (basePrice && (!data.unit_price || data.unit_price === '0' || data.unit_price === '0.00' || data._design_picked !== data.fc)) {
            setData((d: any) => ({
                ...d,
                unit_price: basePrice,
                _design_picked: data.fc // Track that we picked this design's price
            }));
        }
    }, [data.fc, designs]);

    return (
        <div className="space-y-8">
            <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Datos generales</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="grid gap-2">
                        <Label htmlFor="order_number">Pedido</Label>
                        <Input
                            id="order_number"
                            name="order_number"
                            type="number"
                            min={0}
                            value={data.order_number ?? ''}
                            onChange={(e) => setData('order_number', e.target.value)}
                        />
                        <InputError message={errors.order_number} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="client_id">Cliente *</Label>
                        <select
                            id="client_id"
                            name="client_id"
                            required
                            className={selectClass}
                            value={data.client_id ?? ''}
                            onChange={(e) => setData('client_id', e.target.value)}
                        >
                            <option value="">Seleccione cliente</option>
                            {clients.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.client_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="work_id">Obra *</Label>
                        <select
                            id="work_id"
                            name="work_id"
                            required
                            className={selectClass}
                            value={data.work_id ?? ''}
                            onChange={(e) => setData('work_id', e.target.value)}
                        >
                            <option value="">Seleccione obra</option>
                            {works.map((w) => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.work_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="usage_id">Uso</Label>
                        <select
                            id="usage_id"
                            name="usage_id"
                            className={selectClass}
                            value={data.usage_id ?? ''}
                            onChange={(e) => setData('usage_id', e.target.value)}
                        >
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
                            value={data.departure_date ?? ''}
                            onChange={(e) => setData('departure_date', e.target.value)}
                        />
                        <InputError message={errors.departure_date} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="invoice">Factura</Label>
                        <Input
                            id="invoice"
                            name="invoice"
                            maxLength={255}
                            value={data.invoice ?? ''}
                            onChange={(e) => setData('invoice', e.target.value)}
                        />
                        <InputError message={errors.invoice} />
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Concreto</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="grid gap-2">
                        <Label htmlFor="fc">Fc</Label>
                        <select
                            id="fc"
                            name="fc"
                            className={selectClass}
                            value={data.fc ?? ''}
                            onChange={(e) => setData('fc', e.target.value)}
                        >
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
                        <select
                            id="concrete_type_id"
                            name="concrete_type_id"
                            className={selectClass}
                            value={data.concrete_type_id ?? ''}
                            onChange={(e) => setData('concrete_type_id', e.target.value)}
                        >
                            <option value="">Seleccione</option>
                            {concreteTypes.map((ct) => (
                                <option key={ct.id} value={ct.id}>{ct.type}{ct.concept ? ` - ${ct.concept}` : ''}</option>
                            ))}
                        </select>
                        <InputError message={errors.concrete_type_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="concept">Concepto</Label>
                        <Input
                            id="concept"
                            name="concept"
                            maxLength={255}
                            value={data.concept ?? ''}
                            onChange={(e) => setData('concept', e.target.value)}
                        />
                        <InputError message={errors.concept} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="added">Añadido</Label>
                        <Input
                            id="added"
                            name="added"
                            type="number"
                            min={0}
                            value={data.added ?? ''}
                            onChange={(e) => setData('added', e.target.value)}
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
                            value={data.slump ?? ''}
                            onChange={(e) => setData('slump', e.target.value)}
                        />
                        <InputError message={errors.slump} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="quantity">Cantidad</Label>
                        <Input
                            id="quantity"
                            name="quantity"
                            type="number"
                            step="0.01"
                            min={0}
                            value={data.quantity ?? ''}
                            onChange={(e) => setData('quantity', e.target.value)}
                        />
                        <InputError message={errors.quantity} />
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Opciones</h3>
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="pump"
                            name="pump"
                            checked={!!data.pump}
                            onCheckedChange={(checked) => setData('pump', checked)}
                        />
                        <Label htmlFor="pump">Bomba</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="impermeable"
                            name="impermeable"
                            checked={!!data.impermeable}
                            onCheckedChange={(checked) => setData('impermeable', checked)}
                        />
                        <Label htmlFor="impermeable">Imper</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="fiber"
                            name="fiber"
                            checked={!!data.fiber}
                            onCheckedChange={(checked) => setData('fiber', checked)}
                        />
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
                        <Input
                            id="specification"
                            name="specification"
                            maxLength={500}
                            value={data.specification ?? ''}
                            onChange={(e) => setData('specification', e.target.value)}
                        />
                        <InputError message={errors.specification} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="product">Producto</Label>
                        <Input
                            id="product"
                            name="product"
                            maxLength={255}
                            value={data.product ?? ''}
                            onChange={(e) => setData('product', e.target.value)}
                        />
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
                            value={data.observations ?? ''}
                            onChange={(e) => setData('observations', e.target.value)}
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
                        <select
                            id="pot_id"
                            name="pot_id"
                            className={selectClass}
                            value={data.pot_id ?? ''}
                            onChange={(e) => setData('pot_id', e.target.value)}
                        >
                            <option value="">Seleccione</option>
                            {pots.map((p) => (
                                <option key={p.id} value={p.id}>{p.number}</option>
                            ))}
                        </select>
                        <InputError message={errors.pot_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="operator_id">Operador</Label>
                        <select
                            id="operator_id"
                            name="operator_id"
                            className={selectClass}
                            value={data.operator_id ?? ''}
                            onChange={(e) => setData('operator_id', e.target.value)}
                        >
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
                        <Input
                            id="cement_amount"
                            name="cement_amount"
                            type="number"
                            min={0}
                            value={data.cement_amount ?? ''}
                            onChange={(e) => setData('cement_amount', e.target.value)}
                        />
                        <InputError message={errors.cement_amount} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="additive_amount">Aditivo</Label>
                        <Input
                            id="additive_amount"
                            name="additive_amount"
                            type="number"
                            step="0.01"
                            min={0}
                            value={data.additive_amount ?? ''}
                            onChange={(e) => setData('additive_amount', e.target.value)}
                        />
                        <InputError message={errors.additive_amount} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="fiber_amount">Fibra (cant.)</Label>
                        <Input
                            id="fiber_amount"
                            name="fiber_amount"
                            type="number"
                            step="0.01"
                            min={0}
                            value={data.fiber_amount ?? ''}
                            onChange={(e) => setData('fiber_amount', e.target.value)}
                        />
                        <InputError message={errors.fiber_amount} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="gravel">Grava</Label>
                        <Input
                            id="gravel"
                            name="gravel"
                            type="number"
                            step="0.01"
                            min={0}
                            value={data.gravel ?? ''}
                            onChange={(e) => setData('gravel', e.target.value)}
                        />
                        <InputError message={errors.gravel} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="sand">Arena</Label>
                        <Input
                            id="sand"
                            name="sand"
                            type="number"
                            step="0.01"
                            min={0}
                            value={data.sand ?? ''}
                            onChange={(e) => setData('sand', e.target.value)}
                        />
                        <InputError message={errors.sand} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="water">Agua</Label>
                        <Input
                            id="water"
                            name="water"
                            type="number"
                            step="0.01"
                            min={0}
                            value={data.water ?? ''}
                            onChange={(e) => setData('water', e.target.value)}
                        />
                        <InputError message={errors.water} />
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Precios</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="grid gap-2">
                        <Label htmlFor="unit_price">Precio unitario ($)</Label>
                        <Input
                            id="unit_price"
                            name="unit_price"
                            type="number"
                            step="0.01"
                            min={0}
                            value={data.unit_price ?? ''}
                            onChange={(e) => setData('unit_price', e.target.value)}
                        />
                        <InputError message={errors.unit_price} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="iva_percentage">IVA (%)</Label>
                        <Input
                            id="iva_percentage"
                            name="iva_percentage"
                            type="number"
                            min={0}
                            max={100}
                            value={data.iva_percentage ?? '16'}
                            onChange={(e) => setData('iva_percentage', e.target.value)}
                        />
                        <InputError message={errors.iva_percentage} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="subtotal">Subtotal</Label>
                        <div className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm shadow-sm transition-colors flex-items-center">
                            {data.subtotal ?? '0.00'}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="iva">IVA ($)</Label>
                        <div className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm shadow-sm transition-colors flex-items-center">
                            {data.iva ?? '0.00'}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="total">Total ($)</Label>
                        <div className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm shadow-sm transition-colors flex-items-center font-bold">
                            {data.total ?? '0.00'}
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Otros</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="tp">TP</Label>
                        <Input
                            id="tp"
                            name="tp"
                            maxLength={100}
                            value={data.tp ?? ''}
                            onChange={(e) => setData('tp', e.target.value)}
                        />
                        <InputError message={errors.tp} />
                    </div>
                </div>
            </section>
        </div>
    );
}
