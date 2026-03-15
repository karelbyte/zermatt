<?php

namespace App\Http\Controllers;

use App\Http\Requests\Works\StoreWorkRequest;
use App\Http\Requests\Works\UpdateWorkRequest;
use App\Models\Client;
use App\Models\Work;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class WorkController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $like = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        $works = Work::query()
            ->with('client:id,name')
            ->when($search, function ($query, $search) use ($like) {
                $query->where('name', $like, "%{$search}%")
                    ->orWhere('description', $like, "%{$search}%")
                    ->orWhereHas('client', function ($q) use ($search, $like) {
                        $q->where('name', $like, "%{$search}%");
                    });
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('works/index', [
            'works' => $works,
            'filters' => [
                'search' => $search,
            ],
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
