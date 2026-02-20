<?php

use App\Models\Olla;
use App\Models\User;

test('ollas index se muestra a usuarios autenticados', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('ollas.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('ollas/index')
        ->has('ollas')
        ->has('ollas.data')
    );
});

test('formulario de creación de olla se muestra', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('ollas.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('ollas/create'));
});

test('se puede crear una olla', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->post(route('ollas.store'), [
        'number' => '1',
        'capacity' => 50.5,
        'active' => true,
    ]);

    $response->assertRedirect(route('ollas.index'));
    $this->assertDatabaseHas('ollas', [
        'number' => '1',
        'capacity' => 50.5,
        'active' => true,
    ]);
});

test('formulario de edición de olla se muestra', function () {
    $admin = User::factory()->create();
    $olla = Olla::factory()->create();

    $response = $this->actingAs($admin)->get(route('ollas.edit', $olla));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('ollas/edit')
        ->has('olla')
        ->where('olla.id', $olla->id)
    );
});

test('se puede actualizar una olla', function () {
    $admin = User::factory()->create();
    $olla = Olla::factory()->create(['number' => '1']);

    $response = $this->actingAs($admin)->put(route('ollas.update', $olla), [
        'number' => '2',
        'capacity' => 75,
        'active' => false,
    ]);

    $response->assertRedirect(route('ollas.index'));
    $olla->refresh();
    expect($olla->number)->toBe('2')
        ->and($olla->capacity)->toBe(75.0)
        ->and($olla->active)->toBeFalse();
});

test('se puede eliminar una olla', function () {
    $admin = User::factory()->create();
    $olla = Olla::factory()->create();

    $response = $this->actingAs($admin)->delete(route('ollas.destroy', $olla));

    $response->assertRedirect(route('ollas.index'));
    $this->assertModelMissing($olla);
});
