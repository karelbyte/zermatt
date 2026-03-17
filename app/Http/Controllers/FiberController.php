<?php

namespace App\Http\Controllers;

use App\Http\Requests\Fibers\StoreFiberRequest;
use App\Http\Requests\Fibers\UpdateFiberRequest;
use App\Models\Fiber;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FiberController extends Controller
{
    public function index(Request $request): Response
    {
        $fibers = Fiber::query()
            ->with('supplier:id,name')
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('fibers/index', [
            'fibers' => $fibers,
        ]);
    }

    public function create(): Response
    {
        $suppliers = Supplier::query()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('fibers/create', [
            'suppliers' => $suppliers,
        ]);
    }

    public function store(StoreFiberRequest $request): RedirectResponse
    {
        Fiber::query()->create($request->validated());

        return redirect()->route('fibers.index')
            ->with('status', __('Registro de fibra creado correctamente.'));
    }

    public function edit(Fiber $fiber): Response
    {
        if ($fiber->status === 'closed' && !request()->user()->is_admin) {
            abort(403, 'No puedes editar un registro cerrado.');
        }

        $fiber->load('supplier:id,name');
        $suppliers = Supplier::query()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('fibers/edit', [
            'fiber' => $fiber,
            'suppliers' => $suppliers,
        ]);
    }

    public function update(UpdateFiberRequest $request, Fiber $fiber): RedirectResponse
    {
        if ($fiber->status === 'closed' && !$request->user()->is_admin) {
            abort(403, 'No puedes actualizar un registro cerrado.');
        }

        $fiber->update($request->validated());

        return redirect()->route('fibers.index')
            ->with('status', __('Registro de fibra actualizado correctamente.'));
    }

    public function destroy(Fiber $fiber): RedirectResponse
    {
        if ($fiber->status === 'closed' && !request()->user()->is_admin) {
            abort(403, 'No puedes eliminar un registro cerrado.');
        }

        $fiber->delete();

        return redirect()->route('fibers.index')
            ->with('status', __('Registro de fibra eliminado correctamente.'));
    }
}
