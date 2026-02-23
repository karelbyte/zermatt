<?php

use App\Models\Additive;
use App\Models\Supplier;
use App\Models\User;

test('additives index se muestra a usuarios autenticados', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('additives.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('additives/index')
        ->has('additives')
        ->has('additives.data')
    );
});

test('formulario de creación de aditivo se muestra con lista de proveedores', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('additives.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('additives/create')
        ->has('suppliers')
    );
});

test('se puede crear un registro de aditivo con proveedor', function () {
    $admin = User::factory()->create();
    $supplier = Supplier::factory()->create();

    $response = $this->actingAs($admin)->post(route('additives.store'), [
        'date' => '2025-01-15',
        'tons' => 100.5,
        'supplier_id' => $supplier->id,
        'document' => 'DOC-001',
    ]);

    $response->assertRedirect(route('additives.index'));
    $this->assertDatabaseHas('additives', [
        'supplier_id' => $supplier->id,
        'document' => 'DOC-001',
    ]);
    $additive = Additive::query()->where('supplier_id', $supplier->id)->first();
    expect($additive->date?->format('Y-m-d'))->toBe('2025-01-15')
        ->and($additive->tons)->toBe(100.5);
});

test('se puede crear un registro de aditivo sin proveedor', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->post(route('additives.store'), [
        'date' => '2025-01-20',
        'tons' => 50,
        'supplier_id' => '',
    ]);

    $response->assertRedirect(route('additives.index'));
    $this->assertDatabaseHas('additives', [
        'supplier_id' => null,
    ]);
});

test('formulario de edición de aditivo se muestra', function () {
    $admin = User::factory()->create();
    $additive = Additive::factory()->create();

    $response = $this->actingAs($admin)->get(route('additives.edit', $additive));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('additives/edit')
        ->has('additive')
        ->has('suppliers')
        ->where('additive.id', $additive->id)
    );
});

test('se puede actualizar un registro de aditivo', function () {
    $admin = User::factory()->create();
    $additive = Additive::factory()->create(['tons' => 80]);

    $response = $this->actingAs($admin)->put(route('additives.update', $additive), [
        'date' => $additive->date?->format('Y-m-d'),
        'tons' => 120,
        'supplier_id' => $additive->supplier_id,
        'document' => $additive->document,
    ]);

    $response->assertRedirect(route('additives.index'));
    $additive->refresh();
    expect($additive->tons)->toBe(120.0);
});

test('se puede eliminar un registro de aditivo', function () {
    $admin = User::factory()->create();
    $additive = Additive::factory()->create();

    $response = $this->actingAs($admin)->delete(route('additives.destroy', $additive));

    $response->assertRedirect(route('additives.index'));
    $this->assertModelMissing($additive);
});
