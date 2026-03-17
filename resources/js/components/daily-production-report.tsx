import type { Remission } from '@/types';
import { Button } from './ui/button';
import { FileDown } from 'lucide-react';
import { exportDaily, exportDailyPdf } from '@/routes/remissions';
import { formatDate } from '@/lib/utils';

interface Props {
    remissions: Remission[];
    inventoryStats: {
        cement: { received: number; used: number; previous: number };
        additives: { received: number; used: number; previous: number };
        fibers?: { received: number; used: number; previous: number };
        waterproofings?: { received: number; used: number; previous: number };
    };
}

export function DailyProductionReport({ remissions, inventoryStats }: Props) {
    const totalM3 = remissions.reduce((acc, r) => acc + parseFloat(String(r.quantity || 0)), 0);
    const totalPumped = remissions.filter(r => r.pump).reduce((acc, r) => acc + parseFloat(String(r.quantity || 0)), 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Reporte de Producción del Día</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <a href={exportDailyPdf.url()} target="_blank">
                            <FileDown className="mr-2 size-4" />
                            PDF
                        </a>
                    </Button>
                    <Button variant="default" size="sm" asChild>
                        <a href={exportDaily.url()} target="_blank">
                            <FileDown className="mr-2 size-4" />
                            Excel
                        </a>
                    </Button>
                </div>
            </div>

            <div className="rounded-xl border border-sidebar-border/70 overflow-x-auto bg-card">
                <table className="w-full text-left text-[10px] border-collapse">
                    <thead className="border-b border-sidebar-border/70 bg-muted/50 uppercase font-bold">
                        <tr>
                            <th className="p-2 border-r border-sidebar-border/70">Remsn</th>
                            <th className="p-2 border-r border-sidebar-border/70">Cliente</th>
                            <th className="p-2 border-r border-sidebar-border/70">Obra</th>
                            <th className="p-2 border-r border-sidebar-border/70 text-center">M3</th>
                            <th className="p-2 border-r border-sidebar-border/70 text-center">F'c</th>
                            <th className="p-2 border-r border-sidebar-border/70 text-center">Tipo</th>
                            <th className="p-2 border-r border-sidebar-border/70 text-center">Agr</th>
                            <th className="p-2 border-r border-sidebar-border/70 text-center">Rvt</th>
                            <th className="p-2 border-r border-sidebar-border/70 text-center">Bmb</th>
                            <th className="p-2 border-r border-sidebar-border/70 text-center">Cmnto</th>
                            <th className="p-2 border-r border-sidebar-border/70 text-center">Grava</th>
                            <th className="p-2 border-r border-sidebar-border/70 text-center">Arena</th>
                            <th className="p-2 border-r border-sidebar-border/70 text-center">Agua</th>
                            <th className="p-2 border-r border-sidebar-border/70 text-center">Adtv</th>
                            <th className="p-2 border-r border-sidebar-border/70 text-center">Impr</th>
                            <th className="p-2 border-r border-sidebar-border/70 text-center">Fbr</th>
                            <th className="p-2 border-r border-sidebar-border/70 text-center">Olla</th>
                            <th className="p-2 text-center">Hr.S.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {remissions.map((r) => (
                            <tr key={r.id} className="border-b border-sidebar-border/50 hover:bg-muted/30">
                                <td className="p-2 border-r border-sidebar-border/50 font-medium">{r.remision ?? r.order_number}</td>
                                <td
                                    className="p-2 border-r border-sidebar-border/50 truncate max-w-[120px]"
                                    title={r.status === 'cancelada' ? 'Cancelada' : r.client?.name}
                                >
                                    {r.status === 'cancelada' ? 'Cancelada' : r.client?.name}
                                </td>
                                <td
                                    className="p-2 border-r border-sidebar-border/50 truncate max-w-[120px]"
                                    title={r.status === 'cancelada' ? 'Cancelada' : r.work?.name}
                                >
                                    {r.status === 'cancelada' ? 'Cancelada' : r.work?.name}
                                </td>
                                <td className="p-2 border-r border-sidebar-border/50 text-center font-bold text-primary">{r.quantity}</td>
                                <td className="p-2 border-r border-sidebar-border/50 text-center">{r.fc}</td>
                                <td className="p-2 border-r border-sidebar-border/50 text-center">{r.concrete_type?.type ?? r.concreteType?.type}</td>
                                <td className="p-2 border-r border-sidebar-border/50 text-center">{r.added}</td>
                                <td className="p-2 border-r border-sidebar-border/50 text-center">{r.slump}</td>
                                <td className="p-2 border-r border-sidebar-border/50 text-center">{r.pump ? 'P' : '-'}</td>
                                <td className="p-2 border-r border-sidebar-border/50 text-center font-semibold">{r.cement_amount}</td>
                                <td className="p-2 border-r border-sidebar-border/50 text-center">{r.gravel}</td>
                                <td className="p-2 border-r border-sidebar-border/50 text-center">{r.sand}</td>
                                <td className="p-2 border-r border-sidebar-border/50 text-center">{r.water}</td>
                                <td className="p-2 border-r border-sidebar-border/50 text-center">{r.additive_amount || '0'}</td>
                                <td className="p-2 border-r border-sidebar-border/50 text-center">{r.waterproofing_amount || '0'}</td>
                                <td className="p-2 border-r border-sidebar-border/50 text-center">{r.fiber_amount || '0'}</td>
                                <td className="p-2 border-r border-sidebar-border/50 text-center">{r.pot?.number}</td>
                                <td className="p-2 text-center text-muted-foreground">{formatDate(r.departure_date)}</td>
                            </tr>
                        ))}
                        {remissions.length === 0 && (
                            <tr>
                                <td colSpan={18} className="p-8 text-center text-muted-foreground italic">
                                    Sin registros para el día de hoy
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot className="bg-muted/30 font-bold border-t border-sidebar-border/70">
                        <tr>
                            <td colSpan={3} className="p-2 text-right border-r border-sidebar-border/70">TOTAL ELABORADOS:</td>
                            <td className="p-2 text-center border-r border-sidebar-border/70 text-primary">{totalM3.toFixed(1)}</td>
                            <td colSpan={5} className="border-r border-sidebar-border/70"></td>
                            <td className="p-2 text-center border-r border-sidebar-border/70">{remissions.reduce((acc, r) => acc + parseFloat(String(r.cement_amount || 0)), 0)}</td>
                            <td className="p-2 text-center border-r border-sidebar-border/70">{remissions.reduce((acc, r) => acc + parseFloat(String(r.gravel || 0)), 0).toFixed(1)}</td>
                            <td className="p-2 text-center border-r border-sidebar-border/70">{remissions.reduce((acc, r) => acc + parseFloat(String(r.sand || 0)), 0).toFixed(1)}</td>
                            <td className="p-2 text-center border-r border-sidebar-border/70">{remissions.reduce((acc, r) => acc + parseFloat(String(r.water || 0)), 0).toFixed(1)}</td>
                            <td className="p-2 text-center border-r border-sidebar-border/70">{remissions.reduce((acc, r) => acc + parseFloat(String(r.additive_amount || 0)), 0).toFixed(2)}</td>
                            <td className="p-2 text-center border-r border-sidebar-border/70">{remissions.reduce((acc, r) => acc + parseFloat(String(r.waterproofing_amount || 0)), 0).toFixed(2)}</td>
                            <td className="p-2 text-center border-r border-sidebar-border/70">{remissions.reduce((acc, r) => acc + parseFloat(String(r.fiber_amount || 0)), 0).toFixed(2)}</td>
                            <td colSpan={2}></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-sidebar-border/70 p-4 bg-muted/20">
                    <h3 className="text-sm font-bold mb-3 border-b border-sidebar-border/70 pb-2">RESUMEN DE M3</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>M3 Elaborados Estacionaria:</span>
                            <span className="font-bold">0.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span>M3 C/Bomba Pluma:</span>
                            <span className="font-bold">{totalPumped.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between border-t border-sidebar-border/70 pt-2 text-primary">
                            <span className="font-bold">TOTAL M3 BOMBEADOS:</span>
                            <span className="font-bold">{totalPumped.toFixed(1)}</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 p-4 bg-muted/20">
                    <h3 className="text-sm font-bold mb-3 border-b border-sidebar-border/70 pb-2">RESUMEN DE CEMENTO (KG)</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Existencia Anterior:</span>
                            <span className="font-bold">{inventoryStats.cement.previous.toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>(+) Cemento Recibido:</span>
                            <span className="font-bold text-green-600">{inventoryStats.cement.received.toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>(-) Cemento Utilizado:</span>
                            <span className="font-bold text-red-600">{inventoryStats.cement.used.toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
                        </div>
                        <div className="flex justify-between border-t border-sidebar-border/70 pt-2 text-primary">
                            <span className="font-bold">EXISTENCIA ACTUAL:</span>
                            <span className="font-bold">{(inventoryStats.cement.previous + inventoryStats.cement.received - inventoryStats.cement.used).toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 p-4 bg-muted/20">
                    <h3 className="text-sm font-bold mb-3 border-b border-sidebar-border/70 pb-2">RESUMEN DE ADITIVOS (LTS)</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Existencia Anterior:</span>
                            <span className="font-bold">{inventoryStats.additives.previous.toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>(+) Aditivo Recibido:</span>
                            <span className="font-bold text-green-600">{inventoryStats.additives.received.toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>(-) Aditivo Utilizado:</span>
                            <span className="font-bold text-red-600">{inventoryStats.additives.used.toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
                        </div>
                        <div className="flex justify-between border-t border-sidebar-border/70 pt-2 text-primary">
                            <span className="font-bold">EXISTENCIA ACTUAL:</span>
                            <span className="font-bold">{(inventoryStats.additives.previous + inventoryStats.additives.received - inventoryStats.additives.used).toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 p-4 bg-muted/20">
                    <h3 className="text-sm font-bold mb-3 border-b border-sidebar-border/70 pb-2">RESUMEN DE FIBRA</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Existencia Anterior:</span>
                            <span className="font-bold">{(inventoryStats.fibers?.previous ?? 0).toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>(+) Fibra Recibida:</span>
                            <span className="font-bold text-green-600">{(inventoryStats.fibers?.received ?? 0).toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>(-) Fibra Utilizada:</span>
                            <span className="font-bold text-red-600">{(inventoryStats.fibers?.used ?? 0).toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
                        </div>
                        <div className="flex justify-between border-t border-sidebar-border/70 pt-2 text-primary">
                            <span className="font-bold">EXISTENCIA ACTUAL:</span>
                            <span className="font-bold">{((inventoryStats.fibers?.previous ?? 0) + (inventoryStats.fibers?.received ?? 0) - (inventoryStats.fibers?.used ?? 0)).toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 p-4 bg-muted/20">
                    <h3 className="text-sm font-bold mb-3 border-b border-sidebar-border/70 pb-2">RESUMEN DE IMPERMEABILIZANTES (LTS)</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Existencia Anterior:</span>
                            <span className="font-bold">{(inventoryStats.waterproofings?.previous ?? 0).toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>(+) Imper. Recibido:</span>
                            <span className="font-bold text-green-600">{(inventoryStats.waterproofings?.received ?? 0).toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>(-) Imper. Utilizado:</span>
                            <span className="font-bold text-red-600">{(inventoryStats.waterproofings?.used ?? 0).toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
                        </div>
                        <div className="flex justify-between border-t border-sidebar-border/70 pt-2 text-primary">
                            <span className="font-bold">EXISTENCIA ACTUAL:</span>
                            <span className="font-bold">{((inventoryStats.waterproofings?.previous ?? 0) + (inventoryStats.waterproofings?.received ?? 0) - (inventoryStats.waterproofings?.used ?? 0)).toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
