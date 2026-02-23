<?php

use App\Models\Client;
use App\Models\Remission;
use App\Models\User;
use App\Models\Work;

test('remissions index se muestra a usuarios autenticados', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('remissions.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('remissions/index')
        ->has('remissions')
        ->has('remissions.data')
    );
});

test('formulario de creación de remisión se muestra con listas', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('remissions.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('remissions/create')
        ->has('clients')
        ->has('works')
        ->has('usages')
        ->has('concreteTypes')
        ->has('pots')
        ->has('operators')
    );
});

test('se puede crear una remisión', function () {
    $admin = User::factory()->create();
    $client = Client::factory()->create();
    $work = Work::factory()->create(['client_id' => $client->id]);

    $response = $this->actingAs($admin)->post(route('remissions.store'), [
        'client_id' => $client->id,
        'work_id' => $work->id,
        'order_number' => 1001,
        'quantity' => 10.5,
    ]);

    $response->assertRedirect(route('remissions.index'));
    $this->assertDatabaseHas('remissions', [
        'client_id' => $client->id,
        'work_id' => $work->id,
        'order_number' => 1001,
    ]);
});

test('formulario de edición de remisión se muestra', function () {
    $admin = User::factory()->create();
    $remission = Remission::factory()->create();

    $response = $this->actingAs($admin)->get(route('remissions.edit', $remission));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('remissions/edit')
        ->has('remission')
        ->where('remission.id', $remission->id)
    );
});

test('se puede eliminar una remisión', function () {
    $admin = User::factory()->create();
    $remission = Remission::factory()->create();

    $response = $this->actingAs($admin)->delete(route('remissions.destroy', $remission));

    $response->assertRedirect(route('remissions.index'));
    $this->assertModelMissing($remission);
});
