<?php

namespace App\Http\Controllers;

use App\Http\Requests\Waterproofings\StoreWaterproofingRequest;
use App\Http\Requests\Waterproofings\UpdateWaterproofingRequest;
use App\Models\Waterproofing;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WaterproofingController extends Controller
{
    public function index(Request $request): Response
    {
        $waterproofings = Waterproofing::query()
            ->with('supplier:id,name')
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('waterproofings/index', [
            'waterproofings' => $waterproofings,
        ]);
    }

    public function create(): Response
    {
        $suppliers = Supplier::query()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('waterproofings/create', [
            'suppliers' => $suppliers,
        ]);
    }

    public function store(StoreWaterproofingRequest $request): RedirectResponse
    {
        Waterproofing::query()->create($request->validated());

        return redirect()->route('waterproofings.index')
            ->with('status', __('Registro de impermeabilizante creado correctamente.'));
    }

    public function edit(Waterproofing $waterproofing): Response
    {
        if ($waterproofing->status === 'closed' && !request()->user()->is_admin) {
            abort(403, 'No puedes editar un registro cerrado.');
        }

        $waterproofing->load('supplier:id,name');
        $suppliers = Supplier::query()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('waterproofings/edit', [
            'waterproofing' => $waterproofing,
            'suppliers' => $suppliers,
        ]);
    }

    public function update(UpdateWaterproofingRequest $request, Waterproofing $waterproofing): RedirectResponse
    {
        if ($waterproofing->status === 'closed' && !$request->user()->is_admin) {
            abort(403, 'No puedes actualizar un registro cerrado.');
        }

        $waterproofing->update($request->validated());

        return redirect()->route('waterproofings.index')
            ->with('status', __('Registro de impermeabilizante actualizado correctamente.'));
    }

    public function destroy(Waterproofing $waterproofing): RedirectResponse
    {
        if ($waterproofing->status === 'closed' && !request()->user()->is_admin) {
            abort(403, 'No puedes eliminar un registro cerrado.');
        }

        $waterproofing->delete();

        return redirect()->route('waterproofings.index')
            ->with('status', __('Registro de impermeabilizante eliminado correctamente.'));
    }
}
