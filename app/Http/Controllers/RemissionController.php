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

class RemissionController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $remissions = Remission::query()
            ->with(['client:id,name', 'work:id,name', 'usage:id,description', 'pot:id,number', 'operator:id,name'])
            ->when($search, function ($query, $search) {
                $query->where('remision', 'ilike', "%{$search}%")
                    ->orWhere('order_number', 'ilike', "%{$search}%")
                    ->orWhereHas('client', function ($q) use ($search) {
                        $q->where('name', 'ilike', "%{$search}%");
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
        return Inertia::render('remissions/create', $this->dropdowns());
    }

    public function store(StoreRemissionRequest $request): RedirectResponse
    {
        Remission::query()->create($request->validated());

        return redirect()->route('remissions.index')
            ->with('status', __('Remisión creada correctamente.'));
    }

    public function edit(Remission $remission): Response
    {
        $remission->load(['client:id,name', 'work:id,name', 'usage:id,description', 'concreteType:id,type,description', 'pot:id,number', 'operator:id,name']);

        return Inertia::render('remissions/edit', [
            'remission' => $remission,
            ...$this->dropdowns(),
        ]);
    }

    public function update(UpdateRemissionRequest $request, Remission $remission): RedirectResponse
    {
        $remission->update($request->validated());

        return redirect()->route('remissions.index')
            ->with('status', __('Remisión actualizada correctamente.'));
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

        return Inertia::render('remissions/print', [
            'remission' => $remission
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
            ]
        ];

        $pdf = Pdf::loadView('reports.daily-production', compact('remissions', 'inventoryStats'));
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
