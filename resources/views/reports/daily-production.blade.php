<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte Diario de Producción - {{ now()->format('d/m/Y') }}</title>
    <style>
        @page {
            margin: 0.5cm;
            size: letter landscape;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 8px;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .header {
            width: 100%;
            margin-bottom: 10px;
            border-bottom: 2px solid #000;
            padding-bottom: 5px;
        }
        .header h1 {
            margin: 0;
            font-size: 16px;
            text-align: center;
            text-transform: uppercase;
        }
        .header .info {
            text-align: right;
            font-size: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-transform: uppercase;
            border: 1px solid #ccc;
            padding: 3px;
            text-align: center;
        }
        td {
            border: 1px solid #ccc;
            padding: 3px;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        
        /* Specific column widths to handle 18 columns in landscape */
        .col-remsn { width: 30px; }
        .col-client { width: 100px; }
        .col-work { width: 100px; }
        .col-m3 { width: 25px; }
        
        .footer-tables {
            width: 100%;
        }
        .footer-tables td {
            border: none;
            vertical-align: top;
            padding: 0 10px 0 0;
        }
        .summary-table {
            width: 100%;
            border: 1px solid #000;
        }
        .summary-table th {
            background-color: #e0e0e0;
            border: 1px solid #000;
            font-size: 9px;
        }
        .summary-table td {
            border: 1px solid #000;
            font-size: 9px;
            padding: 4px;
        }
        .total-row {
            background-color: #eee;
            font-weight: bold;
        }
        .primary-color { color: #000; } /* Keep it simple for PDF */
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('zermatt01.jpeg') }}" alt="Logo" style="position: absolute; top: 10px; left: 10px; width: 100px;">
        <h1>Reporte de Producción del Día</h1>
        <div class="info">Fecha: {{ now()->format('d/m/Y H:i') }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th class="col-remsn">Remsn</th>
                <th class="col-client">Cliente</th>
                <th class="col-work">Obra</th>
                <th class="col-m3">M3</th>
                <th>F'c</th>
                <th>Tipo</th>
                <th>Agr</th>
                <th>Rvt</th>
                <th>Bmb</th>
                <th>Cmnto</th>
                <th>Grava</th>
                <th>Arena</th>
                <th>Agua</th>
                <th>Adtv</th>
                <th>Impr</th>
                <th>Fbr</th>
                <th>Olla</th>
                <th>Hr.S.</th>
            </tr>
        </thead>
        <tbody>
            @php 
                $totalM3 = 0;
                $totalPumped = 0;
                $totalCement = 0;
                $totalGravel = 0;
                $totalSand = 0;
                $totalWater = 0;
                $totalAdditive = 0;
            @endphp
            @forelse($remissions as $r)
                @php
                    $m3 = (float)($r->quantity ?? 0);
                    $totalM3 += $m3;
                    if($r->pump) $totalPumped += $m3;
                    $totalCement += (float)$r->cement_amount;
                    $totalGravel += (float)$r->gravel;
                    $totalSand += (float)$r->sand;
                    $totalWater += (float)$r->water;
                    $totalAdditive += (float)$r->additive_amount;
                @endphp
                <tr>
                    <td class="text-center font-bold">{{ $r->remision ?? $r->order_number }}</td>
                    <td>{{ $r->status === 'cancelada' ? 'CANCELADA' : Str::limit($r->client?->name, 25) }}</td>
                    <td>{{ $r->status === 'cancelada' ? 'CANCELADA' : Str::limit($r->work?->name, 25) }}</td>
                    <td class="text-center font-bold">{{ number_format($r->quantity, 1) }}</td>
                    <td class="text-center">{{ $r->fc }}</td>
                    <td class="text-center">{{ $r->concreteType?->type }}</td>
                    <td class="text-center">{{ $r->added }}</td>
                    <td class="text-center">{{ $r->slump }}</td>
                    <td class="text-center">{{ $r->pump ? 'P' : '-' }}</td>
                    <td class="text-center font-bold">{{ $r->cement_amount }}</td>
                    <td class="text-center">{{ number_format($r->gravel, 1) }}</td>
                    <td class="text-center">{{ number_format($r->sand, 1) }}</td>
                    <td class="text-center">{{ number_format($r->water, 1) }}</td>
                    <td class="text-center">{{ number_format($r->additive_amount, 1) }}</td>
                    <td class="text-center">{{ $r->impermeable ? '1' : '0' }}</td>
                    <td class="text-center">{{ $r->fiber ? '1' : '0' }}</td>
                    <td class="text-center">{{ $r->pot?->number }}</td>
                    <td class="text-center">{{ $r->departure_date }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="18" class="text-center" style="padding: 20px; font-style: italic;">Sin registros para el día de hoy</td>
                </tr>
            @endforelse
        </tbody>
        @if($remissions->count() > 0)
        <tfoot>
            <tr class="total-row">
                <td colspan="3" class="text-right">TOTAL ELABORADOS:</td>
                <td class="text-center">{{ number_format($totalM3, 1) }}</td>
                <td colspan="5"></td>
                <td class="text-center">{{ number_format($totalCement, 0) }}</td>
                <td class="text-center">{{ number_format($totalGravel, 1) }}</td>
                <td class="text-center">{{ number_format($totalSand, 1) }}</td>
                <td class="text-center">{{ number_format($totalWater, 1) }}</td>
                <td class="text-center">{{ number_format($totalAdditive, 1) }}</td>
                <td colspan="4"></td>
            </tr>
        </tfoot>
        @endif
    </table>

    <table class="footer-tables">
        <tr>
            <td width="33%">
                <table class="summary-table">
                    <thead>
                        <tr><th colspan="2">RESUMEN DE M3</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>M3 Elaborados Estacionaria:</td>
                            <td class="text-right font-bold">0.0</td>
                        </tr>
                        <tr>
                            <td>M3 C/Bomba Pluma:</td>
                            <td class="text-right font-bold">{{ number_format($totalPumped, 1) }}</td>
                        </tr>
                        <tr class="total-row">
                            <td class="font-bold">TOTAL M3 BOMBEADOS:</td>
                            <td class="text-right font-bold">{{ number_format($totalPumped, 1) }}</td>
                        </tr>
                    </tbody>
                </table>
            </td>
            <td width="33%">
                <table class="summary-table">
                    <thead>
                        <tr><th colspan="2">RESUMEN DE CEMENTO (KG)</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Existencia Anterior:</td>
                            <td class="text-right font-bold">{{ number_format($inventoryStats['cement']['previous'], 1) }}</td>
                        </tr>
                        <tr>
                            <td>(+) Cemento Recibido:</td>
                            <td class="text-right font-bold" style="color: green;">{{ number_format($inventoryStats['cement']['received'], 1) }}</td>
                        </tr>
                        <tr>
                            <td>(-) Cemento Utilizado:</td>
                            <td class="text-right font-bold" style="color: red;">{{ number_format($inventoryStats['cement']['used'], 1) }}</td>
                        </tr>
                        <tr class="total-row">
                            <td class="font-bold">EXISTENCIA ACTUAL:</td>
                            <td class="text-right font-bold">{{ number_format($inventoryStats['cement']['previous'] + $inventoryStats['cement']['received'] - $inventoryStats['cement']['used'], 1) }}</td>
                        </tr>
                    </tbody>
                </table>
            </td>
            <td width="33%">
                <table class="summary-table">
                    <thead>
                        <tr><th colspan="2">RESUMEN DE ADITIVOS (LTS)</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Existencia Anterior:</td>
                            <td class="text-right font-bold">{{ number_format($inventoryStats['additives']['previous'], 1) }}</td>
                        </tr>
                        <tr>
                            <td>(+) Aditivo Recibido:</td>
                            <td class="text-right font-bold" style="color: green;">{{ number_format($inventoryStats['additives']['received'], 1) }}</td>
                        </tr>
                        <tr>
                            <td>(-) Aditivo Utilizado:</td>
                            <td class="text-right font-bold" style="color: red;">{{ number_format($inventoryStats['additives']['used'], 1) }}</td>
                        </tr>
                        <tr class="total-row">
                            <td class="font-bold">EXISTENCIA ACTUAL:</td>
                            <td class="text-right font-bold">{{ number_format($inventoryStats['additives']['previous'] + $inventoryStats['additives']['received'] - $inventoryStats['additives']['used'], 1) }}</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
