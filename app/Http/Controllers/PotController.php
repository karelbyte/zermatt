<?php

namespace App\Http\Controllers;

use App\Http\Requests\Pots\StorePotRequest;
use App\Http\Requests\Pots\UpdatePotRequest;
use App\Models\Pot;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PotController extends Controller
{
    public function index(Request $request): Response
    {
        $pots = Pot::query()
            ->orderBy('number')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('pots/index', [
            'pots' => $pots,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('pots/create');
    }

    public function store(StorePotRequest $request): RedirectResponse
    {
        Pot::query()->create($request->validated());

        return redirect()->route('pots.index')
            ->with('status', __('Pot created successfully.'));
    }

    public function edit(Pot $pot): Response
    {
        return Inertia::render('pots/edit', [
            'pot' => $pot,
        ]);
    }

    public function update(UpdatePotRequest $request, Pot $pot): RedirectResponse
    {
        $pot->update($request->validated());

        return redirect()->route('pots.index')
            ->with('status', __('Pot updated successfully.'));
    }

    public function destroy(Pot $pot): RedirectResponse
    {
        $pot->delete();

        return redirect()->route('pots.index')
            ->with('status', __('Pot deleted successfully.'));
    }
}
