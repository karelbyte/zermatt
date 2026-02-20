<?php

namespace App\Http\Controllers;

use App\Http\Requests\Ollas\StoreOllaRequest;
use App\Http\Requests\Ollas\UpdateOllaRequest;
use App\Models\Olla;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OllaController extends Controller
{
    public function index(Request $request): Response
    {
        $ollas = Olla::query()
            ->orderBy('number')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('ollas/index', [
            'ollas' => $ollas,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('ollas/create');
    }

    public function store(StoreOllaRequest $request): RedirectResponse
    {
        Olla::query()->create($request->validated());

        return redirect()->route('ollas.index')
            ->with('status', __('Olla creada correctamente.'));
    }

    public function edit(Olla $olla): Response
    {
        return Inertia::render('ollas/edit', [
            'olla' => $olla,
        ]);
    }

    public function update(UpdateOllaRequest $request, Olla $olla): RedirectResponse
    {
        $olla->update($request->validated());

        return redirect()->route('ollas.index')
            ->with('status', __('Olla actualizada correctamente.'));
    }

    public function destroy(Olla $olla): RedirectResponse
    {
        $olla->delete();

        return redirect()->route('ollas.index')
            ->with('status', __('Olla eliminada correctamente.'));
    }
}
