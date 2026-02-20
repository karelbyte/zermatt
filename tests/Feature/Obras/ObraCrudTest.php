<?php

use App\Models\Client;
use App\Models\Obra;
use App\Models\User;

test('obras index se muestra a usuarios autenticados', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('obras.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('obras/index')
        ->has('obras')
        ->has('obras.data')
    );
});

test('formulario de creación de obra se muestra con lista de clientes', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('obras.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('obras/create')
        ->has('clients')
    );
});

test('se puede crear una obra', function () {
    $admin = User::factory()->create();
    $client = Client::factory()->create();

    $response = $this->actingAs($admin)->post(route('obras.store'), [
        'client_id' => $client->id,
        'name' => 'Obra Norte',
        'description' => 'Descripción de la obra',
        'address' => 'Av. Obra 456',
    ]);

    $response->assertRedirect(route('obras.index'));
    $this->assertDatabaseHas('obras', [
        'client_id' => $client->id,
        'name' => 'Obra Norte',
        'description' => 'Descripción de la obra',
        'address' => 'Av. Obra 456',
    ]);
});

test('formulario de edición de obra se muestra', function () {
    $admin = User::factory()->create();
    $obra = Obra::factory()->create();

    $response = $this->actingAs($admin)->get(route('obras.edit', $obra));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('obras/edit')
        ->has('obra')
        ->has('clients')
        ->where('obra.id', $obra->id)
    );
});

test('se puede actualizar una obra', function () {
    $admin = User::factory()->create();
    $obra = Obra::factory()->create(['name' => 'Antigua']);

    $response = $this->actingAs($admin)->put(route('obras.update', $obra), [
        'client_id' => $obra->client_id,
        'name' => 'Obra Actualizada',
        'description' => $obra->description,
        'address' => $obra->address,
    ]);

    $response->assertRedirect(route('obras.index'));
    $obra->refresh();
    expect($obra->name)->toBe('Obra Actualizada');
});

test('se puede eliminar una obra', function () {
    $admin = User::factory()->create();
    $obra = Obra::factory()->create();

    $response = $this->actingAs($admin)->delete(route('obras.destroy', $obra));

    $response->assertRedirect(route('obras.index'));
    $this->assertModelMissing($obra);
});
