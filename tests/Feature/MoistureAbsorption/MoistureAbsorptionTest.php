<?php

use App\Models\MoistureAbsorptionSetting;
use App\Models\User;

test('página de humedad y absorción se muestra a usuarios autenticados', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('moisture-absorption.edit'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('moisture-absorption/edit')
        ->has('setting')
    );
});

test('se puede crear el único registro de humedad y absorción', function () {
    $admin = User::factory()->create();

    $this->actingAs($admin)->get(route('dashboard'));

    $response = $this->actingAs($admin)->put(route('moisture-absorption.update'), [
        'humidity_gravel' => 1.5,
        'humidity_sand' => 2.0,
        'absorption_gravel' => 0.5,
        'absorption_sand' => 0.8,
    ]);

    $response->assertRedirect(route('dashboard'));
    $this->assertDatabaseHas('moisture_absorption_settings', [
        'humidity_gravel' => 1.5,
        'humidity_sand' => 2.0,
        'absorption_gravel' => 0.5,
        'absorption_sand' => 0.8,
    ]);
});

test('se puede actualizar el único registro de humedad y absorción', function () {
    $admin = User::factory()->create();
    MoistureAbsorptionSetting::factory()->create([
        'humidity_gravel' => 1,
        'humidity_sand' => 1,
        'absorption_gravel' => 0.5,
        'absorption_sand' => 0.5,
    ]);

    $this->actingAs($admin)->get(route('dashboard'));

    $response = $this->actingAs($admin)->put(route('moisture-absorption.update'), [
        'humidity_gravel' => 2.5,
        'humidity_sand' => 3.0,
        'absorption_gravel' => 0.6,
        'absorption_sand' => 0.9,
    ]);

    $response->assertRedirect(route('dashboard'));
    $setting = MoistureAbsorptionSetting::first();
    expect($setting->humidity_gravel)->toBe(2.5)
        ->and($setting->humidity_sand)->toBe(3.0)
        ->and($setting->absorption_gravel)->toBe(0.6)
        ->and($setting->absorption_sand)->toBe(0.9);
});

test('solo existe un registro después de múltiples actualizaciones', function () {
    $admin = User::factory()->create();

    $this->actingAs($admin)->put(route('moisture-absorption.update'), [
        'humidity_gravel' => 1,
        'humidity_sand' => 1,
        'absorption_gravel' => 0.5,
        'absorption_sand' => 0.5,
    ]);

    $this->actingAs($admin)->put(route('moisture-absorption.update'), [
        'humidity_gravel' => 2,
        'humidity_sand' => 2,
        'absorption_gravel' => 0.6,
        'absorption_sand' => 0.6,
    ]);

    expect(MoistureAbsorptionSetting::count())->toBe(1);
});
