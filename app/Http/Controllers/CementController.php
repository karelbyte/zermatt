<?php

namespace App\Http\Controllers;

use App\Http\Requests\Cements\StoreCementRequest;
use App\Http\Requests\Cements\UpdateCementRequest;
use App\Models\Cement;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CementController extends Controller
{
    public function index(Request $request): Response
    {
        $cements = Cement::query()
            ->with('supplier:id,name')
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('cement/index', [
            'cements' => $cements,
        ]);
    }

    public function create(): Response
    {
        $suppliers = Supplier::query()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('cement/create', [
            'suppliers' => $suppliers,
        ]);
    }

    public function store(StoreCementRequest $request): RedirectResponse
    {
        Cement::query()->create($request->validated());

        return redirect()->route('cements.index')
            ->with('status', __('Registro de cemento creado correctamente.'));
    }

    public function edit(Cement $cement): Response
    {
        if ($cement->status === 'closed' && !request()->user()->is_admin) {
            abort(403, 'No puedes editar un registro cerrado.');
        }

        $cement->load('supplier:id,name');
        $suppliers = Supplier::query()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('cement/edit', [
            'cement' => $cement,
            'suppliers' => $suppliers,
        ]);
    }

    public function update(UpdateCementRequest $request, Cement $cement): RedirectResponse
    {
        if ($cement->status === 'closed' && !$request->user()->is_admin) {
            abort(403, 'No puedes actualizar un registro cerrado.');
        }

        $cement->update($request->validated());

        return redirect()->route('cements.index')
            ->with('status', __('Registro de cemento actualizado correctamente.'));
    }

    public function destroy(Cement $cement): RedirectResponse
    {
        if ($cement->status === 'closed' && !request()->user()->is_admin) {
            abort(403, 'No puedes eliminar un registro cerrado.');
        }

        $cement->delete();

        return redirect()->route('cements.index')
            ->with('status', __('Registro de cemento eliminado correctamente.'));
    }
}
