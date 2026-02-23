<?php

namespace App\Http\Controllers;

use App\Http\Requests\Usages\StoreUsageRequest;
use App\Http\Requests\Usages\UpdateUsageRequest;
use App\Models\Usage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UsageController extends Controller
{
    public function index(Request $request): Response
    {
        $usages = Usage::query()
            ->orderBy('description')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('usages/index', [
            'usages' => $usages,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('usages/create');
    }

    public function store(StoreUsageRequest $request): RedirectResponse
    {
        Usage::query()->create($request->validated());

        return redirect()->route('usages.index')
            ->with('status', __('Uso creado correctamente.'));
    }

    public function edit(Usage $usage): Response
    {
        return Inertia::render('usages/edit', [
            'usage' => $usage,
        ]);
    }

    public function update(UpdateUsageRequest $request, Usage $usage): RedirectResponse
    {
        $usage->update($request->validated());

        return redirect()->route('usages.index')
            ->with('status', __('Uso actualizado correctamente.'));
    }

    public function destroy(Usage $usage): RedirectResponse
    {
        $usage->delete();

        return redirect()->route('usages.index')
            ->with('status', __('Uso eliminado correctamente.'));
    }
}
