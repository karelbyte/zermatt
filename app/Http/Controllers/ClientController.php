<?php

namespace App\Http\Controllers;

use App\Http\Requests\Clients\StoreClientRequest;
use App\Http\Requests\Clients\UpdateClientRequest;
use App\Models\Client;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $like = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        $clients = Client::query()
            ->when($search, function ($query, $search) use ($like) {
                $query->where('name', $like, "%{$search}%")
                    ->orWhere('rfc', $like, "%{$search}%")
                    ->orWhere('phone', $like, "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('clients/index', [
            'clients' => $clients,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('clients/create');
    }

    public function store(StoreClientRequest $request): RedirectResponse
    {
        Client::query()->create($request->validated());

        return redirect()->route('clients.index')
            ->with('status', __('Cliente creado correctamente.'));
    }

    public function edit(Client $client): Response
    {
        return Inertia::render('clients/edit', [
            'client' => $client,
        ]);
    }

    public function update(UpdateClientRequest $request, Client $client): RedirectResponse
    {
        $client->update($request->validated());

        return redirect()->route('clients.index')
            ->with('status', __('Cliente actualizado correctamente.'));
    }

    public function destroy(Client $client): RedirectResponse
    {
        $client->delete();

        return redirect()->route('clients.index')
            ->with('status', __('Cliente eliminado correctamente.'));
    }
}
