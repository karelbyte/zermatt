<?php

use App\Models\Client;
use App\Models\User;
use App\Models\Work;

test('works index se muestra a usuarios autenticados', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('works.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('works/index')
        ->has('works')
        ->has('works.data')
    );
});

test('formulario de creación de work se muestra con lista de clientes', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('works.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('works/create')
        ->has('clients')
    );
});

test('se puede crear un work', function () {
    $admin = User::factory()->create();
    $client = Client::factory()->create();

    $response = $this->actingAs($admin)->post(route('works.store'), [
        'client_id' => $client->id,
        'name' => 'Work Norte',
        'description' => 'Descripción del work',
        'address' => 'Av. Work 456',
    ]);

    $response->assertRedirect(route('works.index'));
    $this->assertDatabaseHas('works', [
        'client_id' => $client->id,
        'name' => 'Work Norte',
        'description' => 'Descripción del work',
        'address' => 'Av. Work 456',
    ]);
});

test('formulario de edición de work se muestra', function () {
    $admin = User::factory()->create();
    $work = Work::factory()->create();

    $response = $this->actingAs($admin)->get(route('works.edit', $work));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('works/edit')
        ->has('work')
        ->has('clients')
        ->where('work.id', $work->id)
    );
});

test('se puede actualizar un work', function () {
    $admin = User::factory()->create();
    $work = Work::factory()->create(['name' => 'Antigua']);

    $response = $this->actingAs($admin)->put(route('works.update', $work), [
        'client_id' => $work->client_id,
        'name' => 'Work Actualizado',
        'description' => $work->description,
        'address' => $work->address,
    ]);

    $response->assertRedirect(route('works.index'));
    $work->refresh();
    expect($work->name)->toBe('Work Actualizado');
});

test('se puede eliminar un work', function () {
    $admin = User::factory()->create();
    $work = Work::factory()->create();

    $response = $this->actingAs($admin)->delete(route('works.destroy', $work));

    $response->assertRedirect(route('works.index'));
    $this->assertModelMissing($work);
});
