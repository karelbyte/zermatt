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
        $remissions = Remission::query()
            ->with(['client:id,name', 'work:id,name', 'usage:id,description', 'pot:id,number', 'operator:id,name'])
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('remissions/index', [
            'remissions' => $remissions,
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

    public function exportDailyReport(AdditiveService $additiveService, CementService $cementService)
    {
        $todayRemissions = Remission::whereDate('updated_at', today())->get();
        $todayCementUsed = $todayRemissions->sum('cement_amount');
        $todayCementReceived = \App\Models\Cement::whereDate('date', today())->where('status', 'closed')->sum('tons');
        $currentCement = $cementService->getTotalKg();

        $todayAdditivesUsed = $todayRemissions->sum('additive_amount');
        $todayAdditivesReceived = \App\Models\Additive::whereDate('date', today())->where('status', 'closed')->sum('lit');
        $currentAdditives = $additiveService->getTotalLiters();

        $inventoryStats = [
            'cement' => [
                'received' => $todayCementReceived,
                'used' => $todayCementUsed,
                'previous' => $currentCement + $todayCementUsed - $todayCementReceived,
            ],
            'additives' => [
                'received' => $todayAdditivesReceived,
                'used' => $todayAdditivesUsed,
                'previous' => $currentAdditives + $todayAdditivesUsed - $todayAdditivesReceived,
            ]
        ];

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\DailyProductionExport(null, $inventoryStats),
            'reporte-produccion-' . now()->format('Y-m-d') . '.xlsx'
        );
    }

    public function exportDailyPdf(AdditiveService $additiveService, CementService $cementService)
    {
        $remissions = Remission::with(['client', 'work', 'concreteType', 'pot'])
            ->whereDate('updated_at', today())
            ->get();

        $todayCementUsed = $remissions->sum('cement_amount');
        $todayCementReceived = \App\Models\Cement::whereDate('date', today())->where('status', 'closed')->sum('tons');
        $currentCement = $cementService->getTotalKg();

        $todayAdditivesUsed = $remissions->sum('additive_amount');
        $todayAdditivesReceived = \App\Models\Additive::whereDate('date', today())->where('status', 'closed')->sum('lit');
        $currentAdditives = $additiveService->getTotalLiters();

        $inventoryStats = [
            'cement' => [
                'received' => $todayCementReceived,
                'used' => $todayCementUsed,
                'previous' => $currentCement + $todayCementUsed - $todayCementReceived,
            ],
            'additives' => [
                'received' => $todayAdditivesReceived,
                'used' => $todayAdditivesUsed,
                'previous' => $currentAdditives + $todayAdditivesUsed - $todayAdditivesReceived,
            ]
        ];

        $pdf = Pdf::loadView('reports.daily-production', compact('remissions', 'inventoryStats'));
        $pdf->setPaper('letter', 'landscape');

        return $pdf->download('reporte-produccion-' . now()->format('Y-m-d') . '.pdf');
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
