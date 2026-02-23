<?php

use App\Models\Usage;
use App\Models\User;

test('usages index se muestra a usuarios autenticados', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('usages.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('usages/index')
        ->has('usages')
        ->has('usages.data')
    );
});

test('formulario de creación de usage se muestra', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('usages.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('usages/create'));
});

test('se puede crear un usage', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->post(route('usages.store'), [
        'description' => 'Uso de prueba',
    ]);

    $response->assertRedirect(route('usages.index'));
    $this->assertDatabaseHas('usages', [
        'description' => 'Uso de prueba',
    ]);
});

test('formulario de edición de usage se muestra', function () {
    $admin = User::factory()->create();
    $usage = Usage::factory()->create();

    $response = $this->actingAs($admin)->get(route('usages.edit', $usage));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('usages/edit')
        ->has('usage')
        ->where('usage.id', $usage->id)
    );
});

test('se puede actualizar un usage', function () {
    $admin = User::factory()->create();
    $usage = Usage::factory()->create(['description' => 'Antiguo']);

    $response = $this->actingAs($admin)->put(route('usages.update', $usage), [
        'description' => 'Uso actualizado',
    ]);

    $response->assertRedirect(route('usages.index'));
    $usage->refresh();
    expect($usage->description)->toBe('Uso actualizado');
});

test('se puede eliminar un usage', function () {
    $admin = User::factory()->create();
    $usage = Usage::factory()->create();

    $response = $this->actingAs($admin)->delete(route('usages.destroy', $usage));

    $response->assertRedirect(route('usages.index'));
    $this->assertModelMissing($usage);
});
