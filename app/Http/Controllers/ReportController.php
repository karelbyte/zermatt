<?php

namespace App\Http\Controllers;

use App\Models\Additive;
use App\Models\Cement;
use App\Models\Client;
use App\Models\Remission;
use App\Services\AdditiveService;
use App\Services\CementService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request, AdditiveService $additiveService, CementService $cementService, \App\Services\FiberService $fiberService, \App\Services\WaterproofingService $waterproofingService): Response
    {
        $date = $request->query('date', today()->toDateString());
        $selectedDate = \Carbon\Carbon::parse($date);

        // Get remissions for the selected date
        $dailyRemissions = Remission::with(['client', 'work', 'concreteType', 'pot'])
            ->whereDate('updated_at', $selectedDate)
            ->get();

        // Calculate cement stats for the selected date
        $todayCementUsed = $dailyRemissions->sum('cement_amount');
        $todayCementReceived = Cement::whereDate('date', $selectedDate)
            ->where('status', 'closed')
            ->sum('tons');

        // Calculate additives stats for the selected date
        $todayAdditivesUsed = $dailyRemissions->sum('additive_amount');
        $todayAdditivesReceived = Additive::whereDate('date', $selectedDate)
            ->where('status', 'closed')
            ->sum('lit');

        $todayFibersUsed = $dailyRemissions->sum('fiber_amount');
        $todayFibersReceived = \App\Models\Fiber::whereDate('date', $selectedDate)
            ->where('status', 'closed')
            ->sum('lit');

        $todayWaterproofingsUsed = $dailyRemissions->sum('waterproofing_amount');
        $todayWaterproofingsReceived = \App\Models\Waterproofing::whereDate('date', $selectedDate)
            ->where('status', 'closed')
            ->sum('lit');

        // Calculate inventory up to the START of the selected date (previous day end)
        $cementReceivedBefore = Cement::whereDate('date', '<', $selectedDate)
            ->where('status', 'closed')
            ->sum('tons');
        $cementUsedBefore = Remission::whereDate('updated_at', '<', $selectedDate)
            ->sum('cement_amount');
        $previousCement = $cementReceivedBefore - $cementUsedBefore;

        $additivesReceivedBefore = Additive::whereDate('date', '<', $selectedDate)
            ->where('status', 'closed')
            ->sum('lit');
        $additivesUsedBefore = Remission::whereDate('updated_at', '<', $selectedDate)
            ->sum('additive_amount');
        $previousAdditives = $additivesReceivedBefore - $additivesUsedBefore;

        $fibersReceivedBefore = \App\Models\Fiber::whereDate('date', '<', $selectedDate)
            ->where('status', 'closed')
            ->sum('lit');
        $fibersUsedBefore = Remission::whereDate('updated_at', '<', $selectedDate)
            ->sum('fiber_amount');
        $previousFibers = $fibersReceivedBefore - $fibersUsedBefore;

        $waterproofingsReceivedBefore = \App\Models\Waterproofing::whereDate('date', '<', $selectedDate)
            ->where('status', 'closed')
            ->sum('lit');
        $waterproofingsUsedBefore = Remission::whereDate('updated_at', '<', $selectedDate)
            ->sum('waterproofing_amount');
        $previousWaterproofings = $waterproofingsReceivedBefore - $waterproofingsUsedBefore;

        // Calculate inventory at the END of the selected date
        $finalCement = $previousCement + $todayCementReceived - $todayCementUsed;
        $finalAdditives = $previousAdditives + $todayAdditivesReceived - $todayAdditivesUsed;
        $finalFibers = $previousFibers + $todayFibersReceived - $todayFibersUsed;
        $finalWaterproofings = $previousWaterproofings + $todayWaterproofingsReceived - $todayWaterproofingsUsed;

        return Inertia::render('reports/index', [
            'daily_remissions' => $dailyRemissions,
            'inventory_stats' => [
                'cement' => [
                    'received' => $todayCementReceived,
                    'used' => $todayCementUsed,
                    'previous' => $previousCement,
                    'current' => $finalCement,
                ],
                'additives' => [
                    'received' => $todayAdditivesReceived,
                    'used' => $todayAdditivesUsed,
                    'previous' => $previousAdditives,
                    'current' => $finalAdditives,
                ],
                'fibers' => [
                    'received' => $todayFibersReceived,
                    'used' => $todayFibersUsed,
                    'previous' => $previousFibers,
                    'current' => $finalFibers,
                ],
                'waterproofings' => [
                    'received' => $todayWaterproofingsReceived,
                    'used' => $todayWaterproofingsUsed,
                    'previous' => $previousWaterproofings,
                    'current' => $finalWaterproofings,
                ],
            ],
            'selected_date' => $selectedDate->toDateString(),
        ]);
    }

    public function clientHistory(Request $request): Response
    {
        $clientId = $request->query('client_id');
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        $clients = Client::orderBy('name')->get(['id', 'name']);

        $remissions = collect();
        $totalQuantity = 0;

        if ($clientId && $dateFrom && $dateTo) {
            $remissions = Remission::with(['work:id,name', 'concreteType'])
                ->where('client_id', $clientId)
                ->whereDate('updated_at', '>=', $dateFrom)
                ->whereDate('updated_at', '<=', $dateTo)
                ->where(function ($q) {
                    $q->whereNull('status')->orWhere('status', '!=', 'cancelada');
                })
                ->orderByDesc('updated_at')
                ->get();

            $totalQuantity = $remissions->sum('quantity');
        }

        return Inertia::render('reports/client-history', [
            'clients' => $clients,
            'remissions' => $remissions,
            'total_quantity' => $totalQuantity,
            'filters' => [
                'client_id' => $clientId,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    public function clientHistoryPdf(Request $request)
    {
        $clientId = $request->query('client_id');
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        $client = $clientId ? Client::find($clientId) : null;

        $remissions = collect();
        $totalQuantity = 0;

        if ($clientId && $dateFrom && $dateTo) {
            $remissions = Remission::with(['work:id,name', 'concreteType'])
                ->where('client_id', $clientId)
                ->whereDate('updated_at', '>=', $dateFrom)
                ->whereDate('updated_at', '<=', $dateTo)
                ->where(function ($q) {
                    $q->whereNull('status')->orWhere('status', '!=', 'cancelada');
                })
                ->orderByDesc('updated_at')
                ->get();

            $totalQuantity = $remissions->sum('quantity');
        }

        $dateFromFormatted = $dateFrom ? \Carbon\Carbon::parse($dateFrom)->format('d/m/Y') : '-';
        $dateToFormatted = $dateTo ? \Carbon\Carbon::parse($dateTo)->format('d/m/Y') : '-';

        $pdf = Pdf::loadView('reports.client-history', compact(
            'client', 'remissions', 'totalQuantity', 'dateFromFormatted', 'dateToFormatted'
        ));
        $pdf->setPaper('letter', 'portrait');

        return $pdf->download('historico-cliente-' . ($client?->name ?? 'desconocido') . '.pdf');
    }

    public function monthlySummary(): Response
    {
        $isPgsql = \Illuminate\Support\Facades\DB::connection()->getDriverName() === 'pgsql';

        $yearExpr  = $isPgsql ? 'EXTRACT(YEAR  FROM updated_at)::int' : 'YEAR(updated_at)';
        $monthExpr = $isPgsql ? 'EXTRACT(MONTH FROM updated_at)::int' : 'MONTH(updated_at)';

        $monthly = Remission::selectRaw(
                "$yearExpr as year, $monthExpr as month, SUM(quantity) as total_quantity, COUNT(*) as total_remissions"
            )
            ->where('status', '!=', 'cancelada')
            ->groupByRaw("$yearExpr, $monthExpr")
            ->orderByRaw("$yearExpr DESC, $monthExpr DESC")
            ->get();

        return Inertia::render('reports/monthly-summary', [
            'monthly' => $monthly,
        ]);
    }
}
