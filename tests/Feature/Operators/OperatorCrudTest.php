<?php

use App\Models\Operator;
use App\Models\User;

test('operadores index se muestra a usuarios autenticados', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('operators.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('operators/index')
        ->has('operators')
        ->has('operators.data')
    );
});

test('formulario de creación de operador se muestra', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('operators.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('operators/create'));
});

test('se puede crear un operador', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->post(route('operators.store'), [
        'name' => 'Juan Operador',
        'address' => 'Calle Principal 123',
        'phone' => '5551234567',
    ]);

    $response->assertRedirect(route('operators.index'));
    $this->assertDatabaseHas('operators', [
        'name' => 'Juan Operador',
        'address' => 'Calle Principal 123',
        'phone' => '5551234567',
    ]);
});

test('formulario de edición de operador se muestra', function () {
    $admin = User::factory()->create();
    $operator = Operator::factory()->create();

    $response = $this->actingAs($admin)->get(route('operators.edit', $operator));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('operators/edit')
        ->has('operator')
        ->where('operator.id', $operator->id)
    );
});

test('se puede actualizar un operador', function () {
    $admin = User::factory()->create();
    $operator = Operator::factory()->create(['name' => 'Antiguo']);

    $response = $this->actingAs($admin)->put(route('operators.update', $operator), [
        'name' => 'Operador Actualizado',
        'address' => $operator->address,
        'phone' => $operator->phone,
    ]);

    $response->assertRedirect(route('operators.index'));
    $operator->refresh();
    expect($operator->name)->toBe('Operador Actualizado');
});

test('se puede eliminar un operador', function () {
    $admin = User::factory()->create();
    $operator = Operator::factory()->create();

    $response = $this->actingAs($admin)->delete(route('operators.destroy', $operator));

    $response->assertRedirect(route('operators.index'));
    $this->assertModelMissing($operator);
});
