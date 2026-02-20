<?php

namespace App\Http\Controllers;

use App\Http\Requests\Obras\StoreObraRequest;
use App\Http\Requests\Obras\UpdateObraRequest;
use App\Models\Client;
use App\Models\Obra;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ObraController extends Controller
{
    public function index(Request $request): Response
    {
        $obras = Obra::query()
            ->with('client:id,name')
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('obras/index', [
            'obras' => $obras,
        ]);
    }

    public function create(): Response
    {
        $clients = Client::query()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('obras/create', [
            'clients' => $clients,
        ]);
    }

    public function store(StoreObraRequest $request): RedirectResponse
    {
        Obra::query()->create($request->validated());

        return redirect()->route('obras.index')
            ->with('status', __('Obra creada correctamente.'));
    }

    public function edit(Obra $obra): Response
    {
        $obra->load('client:id,name');
        $clients = Client::query()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('obras/edit', [
            'obra' => $obra,
            'clients' => $clients,
        ]);
    }

    public function update(UpdateObraRequest $request, Obra $obra): RedirectResponse
    {
        $obra->update($request->validated());

        return redirect()->route('obras.index')
            ->with('status', __('Obra actualizada correctamente.'));
    }

    public function destroy(Obra $obra): RedirectResponse
    {
        $obra->delete();

        return redirect()->route('obras.index')
            ->with('status', __('Obra eliminada correctamente.'));
    }
}
