<?php

namespace App\Http\Controllers;

use App\Models\Additive;
use App\Models\Cement;
use App\Models\Client;
use App\Models\Fiber;
use App\Models\Remission;
use App\Models\Supplier;
use App\Models\Waterproofing;
use App\Models\Work;
use App\Services\AdditiveService;
use App\Services\CementService;
use App\Services\FiberService;
use App\Services\WaterproofingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(AdditiveService $additiveService, CementService $cementService, FiberService $fiberService, WaterproofingService $waterproofingService): Response
    {
        $todayRemissions = Remission::whereDate('created_at', today())->get();
        $todayCementUsed = $todayRemissions->sum('cement_amount');
        $todayCementReceived = Cement::whereDate('date', today())->where('status', 'closed')->sum('tons');
        $currentCement = $cementService->getTotalKg();

        $todayAdditivesUsed = $todayRemissions->sum('additive_amount');
        $todayAdditivesReceived = Additive::whereDate('date', today())->where('status', 'closed')->sum('lit');
        $currentAdditives = $additiveService->getTotalLiters();

        $todayFibersUsed = $todayRemissions->sum('fiber_amount');
        $todayFibersReceived = Fiber::whereDate('date', today())->where('status', 'closed')->sum('lit');
        $currentFibers = $fiberService->getTotalAmount();

        $todayWaterproofingsUsed = $todayRemissions->sum('waterproofing_amount');
        $todayWaterproofingsReceived = Waterproofing::whereDate('date', today())->where('status', 'closed')->sum('lit');
        $currentWaterproofings = $waterproofingService->getTotalAmount();

        return Inertia::render('dashboard', [
            'total_additives' => $currentAdditives,
            'total_fibers' => $currentFibers,
            'total_waterproofings' => $currentWaterproofings,
            'total_cement' => $currentCement,
            'count_clients' => Client::count(),
            'count_works' => Work::count(),
            'count_remissions' => Remission::count(),
            'count_suppliers' => Supplier::count(),
            'recent_remissions' => Remission::with(['client:id,name', 'work:id,name'])
                ->orderByDesc('created_at')
                ->limit(10)
                ->get(),
            'daily_remissions' => Remission::with(['client', 'work', 'concreteType', 'pot'])
                ->whereDate('created_at', today())
                ->get(),
            'inventory_stats' => [
                'cement' => [
                    'received' => $todayCementReceived,
                    'used' => $todayCementUsed,
                    'previous' => $currentCement + $todayCementUsed - $todayCementReceived,
                ],
                'additives' => [
                    'received' => $todayAdditivesReceived,
                    'used' => $todayAdditivesUsed,
                    'previous' => $currentAdditives + $todayAdditivesUsed - $todayAdditivesReceived,
                ],
                'fibers' => [
                    'received' => $todayFibersReceived,
                    'used' => $todayFibersUsed,
                    'previous' => $currentFibers + $todayFibersUsed - $todayFibersReceived,
                ],
                'waterproofings' => [
                    'received' => $todayWaterproofingsReceived,
                    'used' => $todayWaterproofingsUsed,
                    'previous' => $currentWaterproofings + $todayWaterproofingsUsed - $todayWaterproofingsReceived,
                ],
            ],
        ]);
    }
}