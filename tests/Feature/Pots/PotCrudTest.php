<?php

use App\Models\Pot;
use App\Models\User;

test('pots index se muestra a usuarios autenticados', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('pots.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('pots/index')
        ->has('pots')
        ->has('pots.data')
    );
});

test('formulario de creación de pot se muestra', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('pots.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('pots/create'));
});

test('se puede crear un pot', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->post(route('pots.store'), [
        'number' => '1',
        'capacity' => 50.5,
        'active' => true,
    ]);

    $response->assertRedirect(route('pots.index'));
    $this->assertDatabaseHas('pots', [
        'number' => '1',
        'capacity' => 50.5,
        'active' => true,
    ]);
});

test('formulario de edición de pot se muestra', function () {
    $admin = User::factory()->create();
    $pot = Pot::factory()->create();

    $response = $this->actingAs($admin)->get(route('pots.edit', $pot));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('pots/edit')
        ->has('pot')
        ->where('pot.id', $pot->id)
    );
});

test('se puede actualizar un pot', function () {
    $admin = User::factory()->create();
    $pot = Pot::factory()->create(['number' => '1']);

    $response = $this->actingAs($admin)->put(route('pots.update', $pot), [
        'number' => '2',
        'capacity' => 75,
        'active' => false,
    ]);

    $response->assertRedirect(route('pots.index'));
    $pot->refresh();
    expect($pot->number)->toBe('2')
        ->and($pot->capacity)->toBe(75.0)
        ->and($pot->active)->toBeFalse();
});

test('se puede eliminar un pot', function () {
    $admin = User::factory()->create();
    $pot = Pot::factory()->create();

    $response = $this->actingAs($admin)->delete(route('pots.destroy', $pot));

    $response->assertRedirect(route('pots.index'));
    $this->assertModelMissing($pot);
});
