<?php

use App\Models\ConcreteType;
use App\Models\Design;
use App\Models\User;

test('designs index se muestra a usuarios autenticados', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('designs.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('designs/index')
        ->has('designs')
        ->has('designs.data')
    );
});

test('formulario de creación de design se muestra con lista de tipos de concreto', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('designs.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('designs/create')
        ->has('concreteTypes')
    );
});

test('se puede crear un design', function () {
    $admin = User::factory()->create();
    $concreteType = ConcreteType::factory()->create();

    $response = $this->actingAs($admin)->post(route('designs.store'), [
        'concrete_type_id' => $concreteType->id,
        'added' => 100,
        'slump' => 12,
        'fc' => 250,
        'cement' => 100.5,
        'sand' => 200.0,
        'gravel' => 150.0,
        'water' => 25.0,
    ]);

    $response->assertRedirect(route('designs.index'));
    $this->assertDatabaseHas('designs', [
        'concrete_type_id' => $concreteType->id,
        'added' => 100,
        'slump' => 12,
        'fc' => 250,
        'cement' => 100.5,
        'sand' => 200.0,
        'gravel' => 150.0,
        'water' => 25.0,
    ]);
});

test('formulario de edición de design se muestra', function () {
    $admin = User::factory()->create();
    $design = Design::factory()->create();

    $response = $this->actingAs($admin)->get(route('designs.edit', $design));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('designs/edit')
        ->has('design')
        ->has('concreteTypes')
        ->where('design.id', $design->id)
    );
});

test('se puede actualizar un design', function () {
    $admin = User::factory()->create();
    $design = Design::factory()->create(['added' => 50, 'slump' => 10]);

    $response = $this->actingAs($admin)->put(route('designs.update', $design), [
        'concrete_type_id' => $design->concrete_type_id,
        'added' => 120,
        'slump' => 15,
        'fc' => $design->fc,
        'cement' => $design->cement,
        'sand' => $design->sand,
        'gravel' => $design->gravel,
        'water' => $design->water,
    ]);

    $response->assertRedirect(route('designs.index'));
    $design->refresh();
    expect($design->added)->toBe(120);
    expect($design->slump)->toBe(15);
});

test('se puede eliminar un design', function () {
    $admin = User::factory()->create();
    $design = Design::factory()->create();

    $response = $this->actingAs($admin)->delete(route('designs.destroy', $design));

    $response->assertRedirect(route('designs.index'));
    $this->assertModelMissing($design);
});
