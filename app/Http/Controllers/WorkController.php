<?php

namespace App\Http\Controllers;

use App\Http\Requests\Works\StoreWorkRequest;
use App\Http\Requests\Works\UpdateWorkRequest;
use App\Models\Client;
use App\Models\Work;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkController extends Controller
{
    public function index(Request $request): Response
    {
        $works = Work::query()
            ->with('client:id,name')
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('works/index', [
            'works' => $works,
        ]);
    }

    public function create(): Response
    {
        $clients = Client::query()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('works/create', [
            'clients' => $clients,
        ]);
    }

    public function store(StoreWorkRequest $request): RedirectResponse
    {
        Work::query()->create($request->validated());

        return redirect()->route('works.index')
            ->with('status', __('Work created successfully.'));
    }

    public function edit(Work $work): Response
    {
        $work->load('client:id,name');
        $clients = Client::query()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('works/edit', [
            'work' => $work,
            'clients' => $clients,
        ]);
    }

    public function update(UpdateWorkRequest $request, Work $work): RedirectResponse
    {
        $work->update($request->validated());

        return redirect()->route('works.index')
            ->with('status', __('Work updated successfully.'));
    }

    public function destroy(Work $work): RedirectResponse
    {
        $work->delete();

        return redirect()->route('works.index')
            ->with('status', __('Work deleted successfully.'));
    }
}
