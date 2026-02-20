<?php

use App\Models\ConcreteType;
use App\Models\User;

test('tipos de concreto index se muestra a usuarios autenticados', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('concrete-types.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('concrete-types/index')
        ->has('concreteTypes')
        ->has('concreteTypes.data')
    );
});

test('formulario de creación de tipo de concreto se muestra', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('concrete-types.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('concrete-types/create'));
});

test('se puede crear un tipo de concreto', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->post(route('concrete-types.store'), [
        'type' => 'A1',
        'concept' => 'Resistencia',
        'description' => 'Concreto estándar',
        'active' => true,
    ]);

    $response->assertRedirect(route('concrete-types.index'));
    $this->assertDatabaseHas('concrete_types', [
        'type' => 'A1',
        'concept' => 'Resistencia',
        'description' => 'Concreto estándar',
        'active' => true,
    ]);
});

test('formulario de edición de tipo de concreto se muestra', function () {
    $admin = User::factory()->create();
    $concreteType = ConcreteType::factory()->create();

    $response = $this->actingAs($admin)->get(route('concrete-types.edit', $concreteType));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('concrete-types/edit')
        ->has('concreteType')
        ->where('concreteType.id', $concreteType->id)
    );
});

test('se puede actualizar un tipo de concreto', function () {
    $admin = User::factory()->create();
    $concreteType = ConcreteType::factory()->create(['type' => 'B2', 'concept' => 'Antiguo']);

    $response = $this->actingAs($admin)->put(route('concrete-types.update', $concreteType), [
        'type' => 'B2',
        'concept' => 'Concepto actualizado',
        'description' => $concreteType->description,
        'active' => $concreteType->active,
    ]);

    $response->assertRedirect(route('concrete-types.index'));
    $concreteType->refresh();
    expect($concreteType->concept)->toBe('Concepto actualizado');
});

test('se puede eliminar un tipo de concreto', function () {
    $admin = User::factory()->create();
    $concreteType = ConcreteType::factory()->create();

    $response = $this->actingAs($admin)->delete(route('concrete-types.destroy', $concreteType));

    $response->assertRedirect(route('concrete-types.index'));
    $this->assertModelMissing($concreteType);
});
