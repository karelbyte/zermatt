<?php

namespace App\Http\Controllers;

use App\Http\Requests\Additives\StoreAdditiveRequest;
use App\Http\Requests\Additives\UpdateAdditiveRequest;
use App\Models\Additive;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdditiveController extends Controller
{
    public function index(Request $request): Response
    {
        $additives = Additive::query()
            ->with('supplier:id,name')
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('additives/index', [
            'additives' => $additives,
        ]);
    }

    public function create(): Response
    {
        $suppliers = Supplier::query()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('additives/create', [
            'suppliers' => $suppliers,
        ]);
    }

    public function store(StoreAdditiveRequest $request): RedirectResponse
    {
        Additive::query()->create($request->validated());

        return redirect()->route('additives.index')
            ->with('status', __('Registro de aditivo creado correctamente.'));
    }

    public function edit(Additive $additive): Response
    {
        if ($additive->status === 'closed' && !request()->user()->is_admin) {
            abort(403, 'No puedes editar un registro cerrado.');
        }

        $additive->load('supplier:id,name');
        $suppliers = Supplier::query()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('additives/edit', [
            'additive' => $additive,
            'suppliers' => $suppliers,
        ]);
    }

    public function update(UpdateAdditiveRequest $request, Additive $additive): RedirectResponse
    {
        if ($additive->status === 'closed' && !$request->user()->is_admin) {
            abort(403, 'No puedes actualizar un registro cerrado.');
        }

        $additive->update($request->validated());

        return redirect()->route('additives.index')
            ->with('status', __('Registro de aditivo actualizado correctamente.'));
    }

    public function destroy(Additive $additive): RedirectResponse
    {
        if ($additive->status === 'closed' && !request()->user()->is_admin) {
            abort(403, 'No puedes eliminar un registro cerrado.');
        }

        $additive->delete();

        return redirect()->route('additives.index')
            ->with('status', __('Registro de aditivo eliminado correctamente.'));
    }
}
