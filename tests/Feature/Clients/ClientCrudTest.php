<?php

use App\Models\Client;
use App\Models\User;

test('clientes index se muestra a usuarios autenticados', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('clients.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('clients/index')
        ->has('clients')
        ->has('clients.data')
    );
});

test('formulario de creación de cliente se muestra', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('clients.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('clients/create'));
});

test('se puede crear un cliente', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->post(route('clients.store'), [
        'name' => 'Cliente SA',
        'address' => 'Calle Principal 123',
        'phone' => '5551234567',
        'rfc' => 'ABC123456XYZ',
    ]);

    $response->assertRedirect(route('clients.index'));
    $this->assertDatabaseHas('clients', [
        'name' => 'Cliente SA',
        'address' => 'Calle Principal 123',
        'phone' => '5551234567',
        'rfc' => 'ABC123456XYZ',
    ]);
});

test('formulario de edición de cliente se muestra', function () {
    $admin = User::factory()->create();
    $client = Client::factory()->create();

    $response = $this->actingAs($admin)->get(route('clients.edit', $client));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('clients/edit')
        ->has('client')
        ->where('client.id', $client->id)
    );
});

test('se puede actualizar un cliente', function () {
    $admin = User::factory()->create();
    $client = Client::factory()->create(['name' => 'Antiguo']);

    $response = $this->actingAs($admin)->put(route('clients.update', $client), [
        'name' => 'Cliente Actualizado',
        'address' => $client->address,
        'phone' => $client->phone,
        'rfc' => $client->rfc,
    ]);

    $response->assertRedirect(route('clients.index'));
    $client->refresh();
    expect($client->name)->toBe('Cliente Actualizado');
});

test('se puede eliminar un cliente', function () {
    $admin = User::factory()->create();
    $client = Client::factory()->create();

    $response = $this->actingAs($admin)->delete(route('clients.destroy', $client));

    $response->assertRedirect(route('clients.index'));
    $this->assertModelMissing($client);
});
