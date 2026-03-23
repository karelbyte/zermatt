import { Head } from '@inertiajs/react';
import type { RemissionPrintProps } from '@/types';
import { useEffect } from 'react';

export default function PrintRemission({ remission, delivered_to_date }: RemissionPrintProps) {
    useEffect(() => {
        // Auto-trigger print dialog
        window.print();
    }, []);

    // Laravel may serialize camelCase relations as snake_case keys (e.g. `concreteType` -> `concrete_type`).
    const concreteType = (remission as any).concreteType ?? (remission as any).concrete_type;
    const deliveredToDate = delivered_to_date ?? null;
    const initialTotal = remission.initial_total_quantity != null ? Number(remission.initial_total_quantity) : null;
    const deliveredLabel = (deliveredToDate != null && initialTotal != null)
        ? `${Number(deliveredToDate).toFixed(1)}/${Number(initialTotal).toFixed(1)}`
        : `${remission.quantity ?? ''}`;

    // Use updated_at as requested, falling back to current date if missing
    const dateStr = remission.updated_at ?? new Date().toISOString();

    // If it's a simple YYYY-MM-DD string, append time to force local parsing
    const finalDateStr = (dateStr.length === 10 && dateStr.includes('-')) ? dateStr + 'T00:00:00' : dateStr;
    const date = new Date(finalDateStr);

    // Check for valid date
    const isValidDate = !isNaN(date.getTime());
    const day = isValidDate ? date.getDate().toString().padStart(2, '0') : '--';
    const month = isValidDate ? (date.getMonth() + 1).toString().padStart(2, '0') : '--';
    const year = isValidDate ? date.getFullYear().toString() : '----';

    return (
        <div className="bg-white min-h-screen font-serif p-0 m-0 print:m-0 print:p-0">
            <Head title={`Imprimir Remisión ${remission.order_number}`} />

            {/* Background Image Container - Adjusted to Letter Size (8.5in x 11in) */}
            <div className="relative w-[8.5in] h-[11in] mx-auto overflow-hidden text-black uppercase text-[14px]">
                {/* The letterhead image - Assuming the user will provide this file 
                <img
                    src="/images/remission-bg.jpg"
                    className="absolute inset-0 w-full h-auto opacity-30 print:opacity-100"
                    alt="Membrete"
                />*/}

                {/* Data Overlay - Precisely positioned based on the image layout (Shisted down 20px) */}

                {/* Folio */}


                {/* Date - Shifted up 5px from previous position (130px -> 125px) */}
                <div className="absolute top-[125px] right-[215px] text-center w-8 font-semibold">{day}</div>
                <div className="absolute top-[125px] right-[128px] text-center w-8 font-semibold">{month}</div>
                <div className="absolute top-[125px] right-[50px] text-center w-10 font-semibold">{year}</div>

                {/* Cliente y Obra */}
                <div className="absolute top-[165px] left-[65px] w-[300px] truncate font-semibold">{remission.status === 'cancelada' ? 'CANCELADA' : remission.client?.name}</div>
                <div className="absolute top-[165px] left-[420px] w-[280px] truncate font-semibold">{remission.status === 'cancelada' ? 'CANCELADA' : remission.work?.name}</div>

                {/* Pedido, Producto Solicitado, Uso, Surtidos, Por Surtir, Horario */}
                <div className="absolute top-[218px] left-[50px] w-20 text-center font-semibold">{remission.order_number}</div>
                <div className="absolute top-[218px] left-[150px] w-[230px] truncate font-semibold">{remission.product ?? concreteType?.type}</div>
                <div className="absolute top-[218px] left-[400px] w-[70px] text-center font-semibold">{remission.usage?.description}</div>
                <div className="absolute top-[218px] left-[510px] w-[50px] text-center font-semibold">{deliveredLabel}</div>
                {/* survido, por_surtir, horario are not in DB currently, but we can put placeholders or empty */}
                <div className="absolute top-[218px] left-[600px] w-[50px] text-center font-semibold">{remission.pending_delivery}</div>


                {/* Detalle Producto */}
                <div className="absolute top-[285px] left-[55px] w-[90px] text-left text-[11px]">F'c: {remission.fc} <span className="lowercase">Kg/Cm2</span></div>
                <div className="absolute top-[305px] left-[55px] w-[90px] text-left text-[11px]">TIPO: {concreteType?.type}</div>
                <div className="absolute top-[325px] left-[55px] w-[90px] text-left text-[12px] ">GRAVA: {remission.added} <span className="lowercase">mm</span></div>
                <div className="absolute top-[300px] left-[160px] w-[70px] text-center text-[12px] font-semibold">{remission.quantity}</div>
                <div className="absolute top-[285px] left-[300px] w-[470px] leading-tight text-[14px] font-semibold">{remission.specification}</div>

                {/* F'c and Slump (Revenimiento) */}

                {/* Slump checkmarks based on common values in the form or value */}

                {remission.fc === 100 && <div className="absolute top-[360px] left-[300px] leading-none ">{remission.slump}</div>}
                {remission.fc === 150 && <div className="absolute top-[357px] left-[328px] leading-none font-semibold">{remission.slump}</div>}
                {remission.fc === 200 && <div className="absolute top-[360px] left-[360px] leading-none font-semibold">{remission.slump}</div>}
                {remission.fc === 250 && <div className="absolute top-[360px] left-[385px] leading-none font-semibold">{remission.slump}</div>}
                {remission.fc === 300 && <div className="absolute top-[360px] left-[418px] leading-none font-semibold">{remission.slump}</div>}
                {remission.fc === 350 && <div className="absolute top-[360px] left-[448px] leading-none font-semibold">{remission.slump}</div>}
                {remission.fc && remission.fc > 350 && <div className="absolute top-[360px] left-[300px]leading-none font-semibold">{remission.slump}</div>}
                {/* ... add more checkmark positions if needed ... */}

                {/* Observaciones */}
                <div className="absolute top-[410px] left-[270px] w-[450px] h-[30px] overflow-hidden lowercase italic font-semibold">
                    {remission.observations}
                </div>

                {/* Horas y Operador */}
                <div className="absolute top-[470px] left-[50px] w-12 text-center font-semibold">  {remission.departure_date}</div> {/* Salida Planta */}
                <div className="absolute top-[470px] left-[95px] w-12 text-center font-semibold"></div>  {/* Entrada Planta */}
                <div className="absolute top-[470px] left-[150px] w-12 text-center font-semibold"></div> {/* Entrada Obra */}
                <div className="absolute top-[205px] left-[205px] w-12 text-center font-semibold"></div> {/* Salida Obra */}

                <div className="absolute top-[460px] left-[310px] w-[180px] text-center font-semibold uppercase text-[12px]">
                    <div>{remission.operator?.name}</div>
                    <div>
                        {(() => {
                            const potName = (remission.pot as any)?.name as string | undefined;
                            const potNumber = remission.pot?.number;
                            const potText = potName ? potName : (potNumber ? `OLLA ${potNumber}` : '');
                            return potText ? potText : '';
                        })()}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        size: letter;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        -webkit-print-color-adjust: exact;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            ` }} />

            {/* Helper to reload if needed */}
            <div className="no-print fixed bottom-4 right-4 flex gap-2">
                <button
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                >
                    Re-Imprimir
                </button>
                <button
                    onClick={() => window.close()}
                    className="bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}
