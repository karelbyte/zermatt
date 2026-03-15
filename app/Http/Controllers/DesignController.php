<?php

namespace App\Http\Controllers;

use App\Http\Requests\Designs\StoreDesignRequest;
use App\Http\Requests\Designs\UpdateDesignRequest;
use App\Models\ConcreteType;
use App\Models\Design;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DesignController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $like = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        $designs = Design::query()
            ->with('concreteType:id,type,concept')
            ->when($search, function ($query, $search) use ($like) {
                $query->where(function ($q) use ($search, $like) {
                    $q->whereHas('concreteType', function ($ct) use ($search, $like) {
                        $ct->where('type', $like, "%{$search}%")
                            ->orWhere('concept', $like, "%{$search}%");
                    });

                    if (is_numeric($search)) {
                        $n = (int) $search;
                        $q->orWhere('fc', $n)
                            ->orWhere('slump', $n)
                            ->orWhere('added', $n);
                    }
                });
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
