<?php

namespace App\Exports;

use App\Models\Remission;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Carbon\Carbon;

class DailyProductionExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithEvents
{
    protected $date;
    protected $remissions;
    protected $inventoryStats;

    public function __construct($date = null, $inventoryStats = null)
    {
        $this->date = $date ? Carbon::parse($date) : Carbon::today();
        $this->remissions = Remission::with(['client', 'work', 'concreteType'])
            ->whereDate('updated_at', $this->date)
            ->get();
        $this->inventoryStats = $inventoryStats;
    }

    public function collection()
    {
        return $this->remissions;
    }

    public function headings(): array
    {
        return [
            ['ZERMAT CONCRETOS, S.A. DE C.V.'],
            ['REPORTE DE PRODUCCION DEL DIA: ' . $this->date->format('d/m/y')],
            [''],
            [
                'Remsn',
                'Cliente',
                'Obra',
                'M3',
                'F\'c',
                'Tipo',
                'Agr',
                'Rvt',
                'Bmb',
                'Cmnto',
                'Grava',
                'Arena',
                'Agua',
                'Adtv',
                'Impr',
                'Fbr',
                'Olla',
                'Hr.S.'
            ]
        ];
    }

    public function map($remission): array
    {
        return [
            $remission->remision ?? $remission->order_number,
            $remission->client?->name,
            $remission->work?->name,
            $remission->quantity,
            $remission->fc,
            $remission->concreteType?->type,
            $remission->added,
            $remission->slump,
            $remission->pump ? 'P' : '',
            $remission->cement_amount,
            $remission->gravel,
            $remission->sand,
            $remission->water,
            $remission->additive_amount,
            $remission->impermeable ? '1' : '0',
            $remission->fiber ? '1' : '0',
            $remission->pot?->number,
            $remission->departure_date ? Carbon::parse($remission->departure_date)->format('H:i') : ''
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 14]],
            2 => ['font' => ['bold' => true]],
            4 => [
                'font' => ['bold' => true],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    ],
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E0E0E0'],
                ],
            ],
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $lastRow = $this->remissions->count() + 4;
                $sheet = $event->sheet;

                // Merge Title Cells
                $sheet->mergeCells('A1:R1');
                $sheet->mergeCells('A2:R2');

                // Add Totals Row
                $nextRow = $lastRow + 1;
                $sheet->setCellValue('D' . $nextRow, '=SUM(D5:D' . $lastRow . ')');
                $sheet->setCellValue('J' . $nextRow, '=SUM(J5:J' . $lastRow . ')');
                $sheet->setCellValue('K' . $nextRow, '=SUM(K5:K' . $lastRow . ')');
                $sheet->setCellValue('L' . $nextRow, '=SUM(L5:L' . $lastRow . ')');
                $sheet->setCellValue('M' . $nextRow, '=SUM(M5:M' . $lastRow . ')');
                $sheet->setCellValue('N' . $nextRow, '=SUM(N5:N' . $lastRow . ')');

                $sheet->getStyle('A4:R' . $nextRow)->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
                $sheet->getStyle('A' . $nextRow . ':R' . $nextRow)->getFont()->setBold(true);

                // Summary Tables (M3 Elaborados, etc.)
                $summaryRow = $nextRow + 2;
                $totalM3 = $this->remissions->sum('quantity');
                $totalPumped = $this->remissions->where('pump', true)->sum('quantity');

                $sheet->setCellValue('A' . $summaryRow, 'M3 ELABORADOS:');
                $sheet->setCellValue('D' . $summaryRow, $totalM3);

                $sheet->setCellValue('A' . ($summaryRow + 1), 'M3 ELAB. ESTACIONARIA:');
                $sheet->setCellValue('D' . ($summaryRow + 1), $totalM3 - $totalPumped);

                $sheet->setCellValue('A' . ($summaryRow + 2), 'M3 C/BOMBA PLUMA:');
                $sheet->setCellValue('D' . ($summaryRow + 2), $totalPumped);

                $sheet->setCellValue('A' . ($summaryRow + 3), 'TOTAL M3 BOMBEADOS:');
                $sheet->setCellValue('D' . ($summaryRow + 3), $totalPumped);

                // Inventory Tables (Cement and Additives)
                if ($this->inventoryStats) {
                    // Cement Inventory
                    $invRow = $summaryRow;
                    $sheet->setCellValue('F' . $invRow, 'RESUMEN CEMENTO (KG)');
                    $sheet->mergeCells('F' . $invRow . ':I' . $invRow);
                    $sheet->getStyle('F' . $invRow)->getFont()->setBold(true);

                    $sheet->setCellValue('F' . ($invRow + 1), 'Existencia Anterior:');
                    $sheet->setCellValue('I' . ($invRow + 1), $this->inventoryStats['cement']['previous']);

                    $sheet->setCellValue('F' . ($invRow + 2), '(+) Cemento Recibido:');
                    $sheet->setCellValue('I' . ($invRow + 2), $this->inventoryStats['cement']['received']);

                    $sheet->setCellValue('F' . ($invRow + 3), '(-) Cemento Utilizado:');
                    $sheet->setCellValue('I' . ($invRow + 3), $this->inventoryStats['cement']['used']);

                    $sheet->setCellValue('F' . ($invRow + 4), 'EXISTENCIA ACTUAL:');
                    $sheet->setCellValue('I' . ($invRow + 4), $this->inventoryStats['cement']['previous'] + $this->inventoryStats['cement']['received'] - $this->inventoryStats['cement']['used']);
                    $sheet->getStyle('F' . ($invRow + 4) . ':I' . ($invRow + 4))->getFont()->setBold(true);

                    // Additives Inventory
                    $addInvRow = $invRow + 6;
                    $sheet->setCellValue('F' . $addInvRow, 'RESUMEN ADITIVOS (LTS)');
                    $sheet->mergeCells('F' . $addInvRow . ':I' . $addInvRow);
                    $sheet->getStyle('F' . $addInvRow)->getFont()->setBold(true);

                    $sheet->setCellValue('F' . ($addInvRow + 1), 'Existencia Anterior:');
                    $sheet->setCellValue('I' . ($addInvRow + 1), $this->inventoryStats['additives']['previous']);

                    $sheet->setCellValue('F' . ($addInvRow + 2), '(+) Aditivo Recibido:');
                    $sheet->setCellValue('I' . ($addInvRow + 2), $this->inventoryStats['additives']['received']);

                    $sheet->setCellValue('F' . ($addInvRow + 3), '(-) Aditivo Utilizado:');
                    $sheet->setCellValue('I' . ($addInvRow + 3), $this->inventoryStats['additives']['used']);

                    $sheet->setCellValue('F' . ($addInvRow + 4), 'EXISTENCIA ACTUAL:');
                    $sheet->setCellValue('I' . ($addInvRow + 4), $this->inventoryStats['additives']['previous'] + $this->inventoryStats['additives']['received'] - $this->inventoryStats['additives']['used']);
                    $sheet->getStyle('F' . ($addInvRow + 4) . ':I' . ($addInvRow + 4))->getFont()->setBold(true);

                    // Styling for summaries
                    $sheet->getStyle('F' . $invRow . ':I' . ($invRow + 4))->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
                    $sheet->getStyle('F' . $addInvRow . ':I' . ($addInvRow + 4))->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
                }

                // Styling for M3 summary
                $sheet->getStyle('A' . $summaryRow . ':D' . ($summaryRow + 3))->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
                $sheet->getStyle('A' . $summaryRow . ':A' . ($summaryRow + 3))->getFont()->setBold(true);
            },
        ];
    }
}
