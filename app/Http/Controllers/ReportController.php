<?php

namespace App\Http\Controllers;

use App\Models\Additive;
use App\Models\Cement;
use App\Models\Remission;
use App\Services\AdditiveService;
use App\Services\CementService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request, AdditiveService $additiveService, CementService $cementService): Response
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

        // Calculate inventory at the END of the selected date
        $finalCement = $previousCement + $todayCementReceived - $todayCementUsed;
        $finalAdditives = $previousAdditives + $todayAdditivesReceived - $todayAdditivesUsed;

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
            ],
            'selected_date' => $selectedDate->toDateString(),
        ]);
    }
}
