<?php

namespace App\Http\Controllers;

use App\Http\Requests\Operators\StoreOperatorRequest;
use App\Http\Requests\Operators\UpdateOperatorRequest;
use App\Models\Operator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OperatorController extends Controller
{
    public function index(Request $request): Response
    {
        $operators = Operator::query()
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('operators/index', [
            'operators' => $operators,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('operators/create');
    }

    public function store(StoreOperatorRequest $request): RedirectResponse
    {
        Operator::query()->create($request->validated());

        return redirect()->route('operators.index')
            ->with('status', __('Operador creado correctamente.'));
    }

    public function edit(Operator $operator): Response
    {
        return Inertia::render('operators/edit', [
            'operator' => $operator,
        ]);
    }

    public function update(UpdateOperatorRequest $request, Operator $operator): RedirectResponse
    {
        $operator->update($request->validated());

        return redirect()->route('operators.index')
            ->with('status', __('Operador actualizado correctamente.'));
    }

    public function destroy(Operator $operator): RedirectResponse
    {
        $operator->delete();

        return redirect()->route('operators.index')
            ->with('status', __('Operador eliminado correctamente.'));
    }
}
