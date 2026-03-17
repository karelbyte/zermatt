<?php

namespace App\Http\Controllers;

use App\Http\Requests\Remissions\StoreRemissionRequest;
use App\Http\Requests\Remissions\UpdateRemissionRequest;
use App\Models\Client;
use App\Models\ConcreteType;
use App\Models\Design;
use App\Models\Operator;
use App\Models\Pot;
use App\Models\Remission;
use App\Models\Usage;
use App\Models\Work;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\AdditiveService;
use App\Services\CementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RemissionController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $like = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        $remissions = Remission::query()
            ->with(['client:id,name', 'work:id,name', 'usage:id,description', 'pot:id,number', 'operator:id,name'])
            ->when($search, function ($query, $search) use ($like) {
                $query->where(function ($q) use ($search, $like) {
                    $q->where('remision', $like, "%{$search}%")
                        ->orWhereHas('client', function ($clientQ) use ($search, $like) {
                            $clientQ->where('name', $like, "%{$search}%");
                        });

                    if (is_numeric($search)) {
                        $q->orWhere('order_number', (int) $search);
                    }
                });
            })
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('remissions/index', [
            'remissions' => $remissions,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        $dayStart = now()->startOfDay();
        $dayEnd = now()->endOfDay();

        $lastOrder = Remission::query()
            ->whereBetween('created_at', [$dayStart, $dayEnd])
            ->whereNotNull('order_number')
            ->where(function ($q) {
                $q->whereNull('status')->orWhere('status', 'activa');
            })
            ->max('order_number');

        $suggestedOrder = $lastOrder ? ((int) $lastOrder + 1) : 1;

        return Inertia::render('remissions/create', [
            ...$this->dropdowns(),
            'last_order_number' => $lastOrder ? (int) $lastOrder : null,
            'suggested_order_number' => $suggestedOrder,
        ]);
    }

    public function store(StoreRemissionRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // If order_number is missing, default to the next number for the current day (starts at 1 each day).
        if (empty($data['order_number'])) {
            $dayStart = now()->startOfDay();
            $dayEnd = now()->endOfDay();
            $lastOrder = Remission::query()
                ->whereBetween('created_at', [$dayStart, $dayEnd])
                ->whereNotNull('order_number')
                ->where(function ($q) {
                    $q->whereNull('status')->orWhere('status', 'activa');
                })
                ->max('order_number');

            $data['order_number'] = $lastOrder ? ((int) $lastOrder + 1) : 1;
        }

        $quantity = isset($data['quantity']) ? (float) $data['quantity'] : 0.0;
        $requestedTotal = $data['total_quantity'] ?? null;

        $deliveryGroupId = null;
        $initialTotalQuantity = null;
        $totalQuantity = null;

        // If there is an open delivery group for the same client + concrete type + fc, the "total to supply" for this
        // dispatch is the remaining group balance (not the per-remission pending_delivery, which becomes stale).
        if (!empty($data['client_id']) && !empty($data['concrete_type_id']) && !empty($data['fc'])) {
            $clientId = (int) $data['client_id'];
            $concreteTypeId = (int) $data['concrete_type_id'];
            $fc = (int) $data['fc'];

            $openGroup = Remission::query()
                ->select([
                    'delivery_group_id',
                    DB::raw('MAX(COALESCE(initial_total_quantity, total_quantity, 0)) as initial_total_quantity'),
                    DB::raw('SUM(COALESCE(quantity, 0)) as delivered'),
                    DB::raw('MAX(id) as last_id'),
                ])
                ->whereNotNull('delivery_group_id')
                ->where('client_id', $clientId)
                ->where('concrete_type_id', $concreteTypeId)
                ->where('fc', $fc)
                ->where(function ($q) {
                    $q->whereNull('status')->orWhere('status', 'activa');
                })
                ->groupBy('delivery_group_id')
                ->havingRaw('MAX(COALESCE(initial_total_quantity, total_quantity, 0)) - SUM(COALESCE(quantity, 0)) > 0')
                ->orderByDesc('last_id')
                ->first();

            if ($openGroup) {
                $deliveryGroupId = $openGroup->delivery_group_id;
                $initialTotalQuantity = (float) $openGroup->initial_total_quantity;
                $remaining = max($initialTotalQuantity - (float) $openGroup->delivered, 0);
                $totalQuantity = $remaining;
            }
        }

        // New group: the first remission defines the immutable initial total.
        if ($deliveryGroupId === null) {
            $deliveryGroupId = (string) Str::uuid();
            $totalQuantity = $requestedTotal !== null ? (float) $requestedTotal : $quantity;
            $initialTotalQuantity = (float) $totalQuantity;
        }

        $data['delivery_group_id'] = $deliveryGroupId;
        $data['initial_total_quantity'] = $initialTotalQuantity;
        $data['total_quantity'] = $totalQuantity;
        $data['pending_delivery'] = max($totalQuantity - $quantity, 0);

        Remission::query()->create($data);

        return redirect()->route('remissions.index')
            ->with('status', __('Remisión creada correctamente.'));
    }

    public function edit(Remission $remission): Response|RedirectResponse
    {
        if ($remission->status === 'cancelada') {
            return redirect()->route('remissions.index')
                ->with('status', __('No se puede editar una remisión cancelada.'));
        }

        $remission->load(['client:id,name', 'work:id,name', 'usage:id,description', 'concreteType:id,type,description', 'pot:id,number', 'operator:id,name']);

        return Inertia::render('remissions/edit', [
            'remission' => $remission,
            ...$this->dropdowns(),
        ]);
    }

    public function update(UpdateRemissionRequest $request, Remission $remission): RedirectResponse
    {
        if ($remission->status === 'cancelada') {
            return redirect()->route('remissions.index')
                ->with('status', __('No se puede editar una remisión cancelada.'));
        }

        $data = $request->validated();

        $quantity = isset($data['quantity']) ? (float) $data['quantity'] : 0.0;
        $totalQuantity = isset($data['total_quantity']) ? (float) $data['total_quantity'] : $quantity;

        $data['total_quantity'] = $totalQuantity;
        $data['pending_delivery'] = max($totalQuantity - $quantity, 0);

        $remission->update($data);

        return redirect()->route('remissions.index')
            ->with('status', __('Remisión actualizada correctamente.'));
    }

    public function pending(Request $request): JsonResponse
    {
        $clientId = (int) $request->query('client_id', 0);
        $concreteTypeId = $request->query('concrete_type_id') !== null ? (int) $request->query('concrete_type_id') : 0;
        $fc = $request->query('fc') !== null ? (int) $request->query('fc') : 0;

        if ($clientId <= 0 || $concreteTypeId <= 0 || $fc <= 0) {
            return response()->json(['pending' => 0]);
        }

        $openGroup = Remission::query()
            ->select([
                'delivery_group_id',
                DB::raw('MAX(COALESCE(initial_total_quantity, total_quantity, 0)) as initial_total_quantity'),
                DB::raw('SUM(COALESCE(quantity, 0)) as delivered'),
                DB::raw('MAX(id) as last_id'),
            ])
            ->whereNotNull('delivery_group_id')
            ->where('client_id', $clientId)
            ->where('concrete_type_id', $concreteTypeId)
            ->where('fc', $fc)
            ->where(function ($q) {
                $q->whereNull('status')->orWhere('status', 'activa');
            })
            ->groupBy('delivery_group_id')
            ->havingRaw('MAX(COALESCE(initial_total_quantity, total_quantity, 0)) - SUM(COALESCE(quantity, 0)) > 0')
            ->orderByDesc('last_id')
            ->first();

        if (!$openGroup) {
            return response()->json(['pending' => 0]);
        }

        $initialTotal = (float) $openGroup->initial_total_quantity;
        $remaining = max($initialTotal - (float) $openGroup->delivered, 0);

        return response()->json([
            'pending' => $remaining,
            'delivery_group_id' => $openGroup->delivery_group_id,
            'initial_total_quantity' => $initialTotal,
        ]);
    }

    public function cancel(Remission $remission): RedirectResponse
    {
        if ($remission->status === 'cancelada') {
            return redirect()->route('remissions.index')
                ->with('status', __('La remisión ya estaba cancelada.'));
        }

        $remission->update([
            'status' => 'cancelada',
            'quantity' => 0,
            'total_quantity' => 0,
            'initial_total_quantity' => 0,
            'pending_delivery' => 0,
            'cement_amount' => 0,
            'additive_amount' => 0,
            'fiber_amount' => 0,
            'waterproofing_amount' => 0,
            'gravel' => 0,
            'sand' => 0,
            'water' => 0,
        ]);

        return redirect()->route('remissions.index')
            ->with('status', __('Remisión cancelada correctamente.'));
    }

    public function destroy(Remission $remission): RedirectResponse
    {
        $remission->delete();

        return redirect()->route('remissions.index')
            ->with('status', __('Remisión eliminada correctamente.'));
    }

    public function print(Remission $remission)
    {
        $remission->load(['client', 'work', 'usage', 'concreteType', 'operator', 'pot']);

        $deliveredToDate = null;
        if ($remission->delivery_group_id) {
            $deliveredToDate = (float) Remission::query()
                ->where('delivery_group_id', $remission->delivery_group_id)
                ->where('status', '!=', 'cancelada')
                ->where('id', '<=', $remission->id)
                ->sum('quantity');
        }

        return Inertia::render('remissions/print', [
            'remission' => $remission,
            'delivered_to_date' => $deliveredToDate,
        ]);
    }

    public function exportDailyReport(Request $request, AdditiveService $additiveService, CementService $cementService)
    {
        $date = $request->query('date', today()->toDateString());
        $selectedDate = \Carbon\Carbon::parse($date);

        $todayRemissions = Remission::whereDate('updated_at', $selectedDate)->get();
        $todayCementUsed = $todayRemissions->sum('cement_amount');
        $todayCementReceived = \App\Models\Cement::whereDate('date', $selectedDate)->where('status', 'closed')->sum('tons');

        $todayAdditivesUsed = $todayRemissions->sum('additive_amount');
        $todayAdditivesReceived = \App\Models\Additive::whereDate('date', $selectedDate)->where('status', 'closed')->sum('lit');

        $todayFibersUsed = $todayRemissions->sum('fiber_amount');
        $todayFibersReceived = \App\Models\Fiber::whereDate('date', $selectedDate)->where('status', 'closed')->sum('lit');

        $todayWaterproofingsUsed = $todayRemissions->sum('waterproofing_amount');
        $todayWaterproofingsReceived = \App\Models\Waterproofing::whereDate('date', $selectedDate)->where('status', 'closed')->sum('lit');

        // Calculate inventory up to the START of the selected date
        $cementReceivedBefore = \App\Models\Cement::whereDate('date', '<', $selectedDate)
            ->where('status', 'closed')
            ->sum('tons');
        $cementUsedBefore = Remission::whereDate('updated_at', '<', $selectedDate)
            ->sum('cement_amount');
        $previousCement = $cementReceivedBefore - $cementUsedBefore;

        $additivesReceivedBefore = \App\Models\Additive::whereDate('date', '<', $selectedDate)
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

        $inventoryStats = [
            'cement' => [
                'received' => $todayCementReceived,
                'used' => $todayCementUsed,
                'previous' => $previousCement,
            ],
            'additives' => [
                'received' => $todayAdditivesReceived,
                'used' => $todayAdditivesUsed,
                'previous' => $previousAdditives,
            ],
            'fibers' => [
                'received' => $todayFibersReceived,
                'used' => $todayFibersUsed,
                'previous' => $previousFibers,
            ],
            'waterproofings' => [
                'received' => $todayWaterproofingsReceived,
                'used' => $todayWaterproofingsUsed,
                'previous' => $previousWaterproofings,
            ]
        ];

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\DailyProductionExport(null, $inventoryStats),
            'reporte-produccion-' . $selectedDate->format('Y-m-d') . '.xlsx'
        );
    }

    public function exportDailyPdf(Request $request, AdditiveService $additiveService, CementService $cementService)
    {
        $date = $request->query('date', today()->toDateString());
        $selectedDate = \Carbon\Carbon::parse($date);

        $remissions = Remission::with(['client', 'work', 'concreteType', 'pot'])
            ->whereDate('updated_at', $selectedDate)
            ->get();

        $todayCementUsed = $remissions->sum('cement_amount');
        $todayCementReceived = \App\Models\Cement::whereDate('date', $selectedDate)->where('status', 'closed')->sum('tons');

        $todayAdditivesUsed = $remissions->sum('additive_amount');
        $todayAdditivesReceived = \App\Models\Additive::whereDate('date', $selectedDate)->where('status', 'closed')->sum('lit');

        $todayFibersUsed = $remissions->sum('fiber_amount');
        $todayFibersReceived = \App\Models\Fiber::whereDate('date', $selectedDate)->where('status', 'closed')->sum('lit');

        $todayWaterproofingsUsed = $remissions->sum('waterproofing_amount');
        $todayWaterproofingsReceived = \App\Models\Waterproofing::whereDate('date', $selectedDate)->where('status', 'closed')->sum('lit');

        // Calculate inventory up to the START of the selected date
        $cementReceivedBefore = \App\Models\Cement::whereDate('date', '<', $selectedDate)
            ->where('status', 'closed')
            ->sum('tons');
        $cementUsedBefore = Remission::whereDate('updated_at', '<', $selectedDate)
            ->sum('cement_amount');
        $previousCement = $cementReceivedBefore - $cementUsedBefore;

        $additivesReceivedBefore = \App\Models\Additive::whereDate('date', '<', $selectedDate)
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

        $inventoryStats = [
            'cement' => [
                'received' => $todayCementReceived,
                'used' => $todayCementUsed,
                'previous' => $previousCement,
            ],
            'additives' => [
                'received' => $todayAdditivesReceived,
                'used' => $todayAdditivesUsed,
                'previous' => $previousAdditives,
            ],
            'fibers' => [
                'received' => $todayFibersReceived,
                'used' => $todayFibersUsed,
                'previous' => $previousFibers,
            ],
            'waterproofings' => [
                'received' => $todayWaterproofingsReceived,
                'used' => $todayWaterproofingsUsed,
                'previous' => $previousWaterproofings,
            ]
        ];

        $pdf = Pdf::loadView('reports.daily-production', compact('remissions', 'inventoryStats', 'selectedDate'));
        $pdf->setPaper('letter', 'landscape');

        return $pdf->download('reporte-produccion-' . $selectedDate->format('Y-m-d') . '.pdf');
    }

    /**
     * @return array{clients: \Illuminate\Support\Collection, works: \Illuminate\Support\Collection, usages: \Illuminate\Support\Collection, concreteTypes: \Illuminate\Support\Collection, pots: \Illuminate\Support\Collection, operators: \Illuminate\Support\Collection}
     */
    private function dropdowns(): array
    {
        return [
            'clients' => Client::query()->orderBy('name')->get(['id', 'name']),
            'works' => Work::query()->with('client:id,name')->orderBy('name')->get(['id', 'name', 'client_id']),
            'usages' => Usage::query()->orderBy('description')->get(['id', 'description']),
            'concreteTypes' => ConcreteType::query()->orderBy('type')->get(['id', 'type', 'concept', 'description']),
            'pots' => Pot::query()->orderBy('number')->get(['id', 'number']),
            'operators' => Operator::query()->orderBy('name')->get(['id', 'name']),
            'designs' => Design::query()->with('concreteType:id,type')->orderByDesc('id')->get(),
        ];
    }
}
