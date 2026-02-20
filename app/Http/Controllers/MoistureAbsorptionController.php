<?php

namespace App\Http\Controllers;

use App\Http\Requests\MoistureAbsorption\UpdateMoistureAbsorptionRequest;
use App\Models\MoistureAbsorptionSetting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MoistureAbsorptionController extends Controller
{
    public function edit(): Response
    {
        $setting = MoistureAbsorptionSetting::query()->first();

        return Inertia::render('moisture-absorption/edit', [
            'setting' => $setting,
        ]);
    }

    public function update(UpdateMoistureAbsorptionRequest $request): RedirectResponse
    {
        $setting = MoistureAbsorptionSetting::query()->first();

        if ($setting) {
            $setting->update($request->validated());
        } else {
            MoistureAbsorptionSetting::query()->create($request->validated());
        }

        return redirect()->back()
            ->with('status', __('Valores de humedad y absorción guardados correctamente.'));
    }
}
