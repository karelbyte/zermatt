<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConcreteTypes\StoreConcreteTypeRequest;
use App\Http\Requests\ConcreteTypes\UpdateConcreteTypeRequest;
use App\Models\ConcreteType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ConcreteTypeController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $concreteTypes = ConcreteType::query()
            ->when($search, function ($query, $search) {
                $query->where('type', 'ilike', "%{$search}%")
                    ->orWhere('concept', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%");
            })
            ->orderBy('type')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('concrete-types/index', [
            'concreteTypes' => $concreteTypes,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('concrete-types/create');
    }

    public function store(StoreConcreteTypeRequest $request): RedirectResponse
    {
        ConcreteType::query()->create($request->validated());

        return redirect()->route('concrete-types.index')
            ->with('status', __('Tipo de concreto creado correctamente.'));
    }

    public function edit(ConcreteType $concreteType): Response
    {
        return Inertia::render('concrete-types/edit', [
            'concreteType' => $concreteType,
        ]);
    }

    public function update(UpdateConcreteTypeRequest $request, ConcreteType $concreteType): RedirectResponse
    {
        $concreteType->update($request->validated());

        return redirect()->route('concrete-types.index')
            ->with('status', __('Tipo de concreto actualizado correctamente.'));
    }

    public function destroy(ConcreteType $concreteType): RedirectResponse
    {
        $concreteType->delete();

        return redirect()->route('concrete-types.index')
            ->with('status', __('Tipo de concreto eliminado correctamente.'));
    }
}
