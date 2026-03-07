<?php

namespace App\Http\Controllers;

use App\Http\Requests\Designs\StoreDesignRequest;
use App\Http\Requests\Designs\UpdateDesignRequest;
use App\Models\ConcreteType;
use App\Models\Design;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DesignController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $designs = Design::query()
            ->with('concreteType:id,type,concept')
            ->when($search, function ($query, $search) {
                $query->whereHas('concreteType', function ($q) use ($search) {
                    $q->where('type', 'ilike', "%{$search}%")
                        ->orWhere('concept', 'ilike', "%{$search}%");
                })
                    ->orWhere('fc', 'ilike', "%{$search}%")
                    ->orWhere('slump', 'ilike', "%{$search}%")
                    ->orWhere('added', 'ilike', "%{$search}%");
            })
            ->orderBy('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('designs/index', [
            'designs' => $designs,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        $concreteTypes = ConcreteType::query()->orderBy('type')->get(['id', 'type', 'concept']);

        return Inertia::render('designs/create', [
            'concreteTypes' => $concreteTypes,
        ]);
    }

    public function store(StoreDesignRequest $request): RedirectResponse
    {
        Design::query()->create($request->validated());

        return redirect()->route('designs.index')
            ->with('status', __('Diseño creado correctamente.'));
    }

    public function edit(Design $design): Response
    {
        $design->load('concreteType:id,type,concept');
        $concreteTypes = ConcreteType::query()->orderBy('type')->get(['id', 'type', 'concept']);

        return Inertia::render('designs/edit', [
            'design' => $design,
            'concreteTypes' => $concreteTypes,
        ]);
    }

    public function update(UpdateDesignRequest $request, Design $design): RedirectResponse
    {
        $design->update($request->validated());

        return redirect()->route('designs.index')
            ->with('status', __('Diseño actualizado correctamente.'));
    }

    public function destroy(Design $design): RedirectResponse
    {
        $design->delete();

        return redirect()->route('designs.index')
            ->with('status', __('Diseño eliminado correctamente.'));
    }
}
