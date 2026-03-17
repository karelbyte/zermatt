<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Histórico de Cliente - {{ $client?->name ?? 'Cliente' }}</title>
    <style>
        @page {
            margin: 1cm;
            size: letter portrait;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 9px;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .header {
            width: 100%;
            margin-bottom: 12px;
            border-bottom: 2px solid #000;
            padding-bottom: 6px;
        }
        .header h1 {
            margin: 0 0 2px 0;
            font-size: 14px;
            text-align: center;
            text-transform: uppercase;
        }
        .header .subtitle {
            text-align: center;
            font-size: 10px;
            color: #555;
        }
        .header .info {
            text-align: right;
            font-size: 9px;
            margin-top: 4px;
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
            padding: 4px;
            text-align: center;
        }
        td {
            border: 1px solid #ccc;
            padding: 4px;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .total-row {
            background-color: #eee;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('zermatt01.jpeg') }}" alt="Logo" style="position: absolute; top: 10px; left: 10px; width: 80px;">
        <h1>Histórico de Cliente</h1>
        <div class="subtitle">{{ $client?->name ?? 'Sin cliente' }}</div>
        <div class="subtitle">Período: {{ $dateFromFormatted }} — {{ $dateToFormatted }}</div>
        <div class="info">Fecha Impresión: {{ now()->format('d/m/Y H:i') }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Remisión</th>
                <th>Pedido</th>
                <th>Obra</th>
                <th>Tipo</th>
                <th>Fc</th>
                <th>M³</th>
            </tr>
        </thead>
        <tbody>
            @forelse($remissions as $r)
                <tr>
                    <td class="text-center">{{ \Carbon\Carbon::parse($r->updated_at)->format('d/m/Y') }}</td>
                    <td class="text-center">{{ $r->remision ?? '-' }}</td>
                    <td class="text-center">{{ $r->order_number ?? '-' }}</td>
                    <td>{{ \Illuminate\Support\Str::limit($r->work?->name, 35) }}</td>
                    <td class="text-center">{{ $r->concreteType?->type }}</td>
                    <td class="text-center">{{ $r->fc }}</td>
                    <td class="text-center font-bold">{{ number_format($r->quantity, 2) }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" class="text-center" style="padding: 20px; font-style: italic;">Sin registros para el período seleccionado</td>
                </tr>
            @endforelse
        </tbody>
        @if($remissions->count() > 0)
        <tfoot>
            <tr class="total-row">
                <td colspan="6" class="text-right">TOTAL M³ DE CONCRETO:</td>
                <td class="text-center">{{ number_format($totalQuantity, 2) }}</td>
            </tr>
        </tfoot>
        @endif
    </table>
</body>
</html>
