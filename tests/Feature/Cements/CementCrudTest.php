<?php

use App\Models\Cement;
use App\Models\Supplier;
use App\Models\User;

test('cemento index se muestra a usuarios autenticados', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('cements.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('cement/index')
        ->has('cements')
        ->has('cements.data')
    );
});

test('formulario de creación de cemento se muestra con lista de proveedores', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('cements.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('cement/create')
        ->has('suppliers')
    );
});

test('se puede crear un registro de cemento con proveedor', function () {
    $admin = User::factory()->create();
    $supplier = Supplier::factory()->create();

    $response = $this->actingAs($admin)->post(route('cements.store'), [
        'date' => '2025-01-15',
        'tons' => 100.5,
        'supplier_id' => $supplier->id,
    ]);

    $response->assertRedirect(route('cements.index'));
    $this->assertDatabaseHas('cements', [
        'supplier_id' => $supplier->id,
    ]);
    $cement = Cement::query()->where('supplier_id', $supplier->id)->first();
    expect($cement->date?->format('Y-m-d'))->toBe('2025-01-15')
        ->and($cement->tons)->toBe(100.5);
});

test('se puede crear un registro de cemento sin proveedor', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->post(route('cements.store'), [
        'date' => '2025-01-20',
        'tons' => 50,
        'supplier_id' => '',
    ]);

    $response->assertRedirect(route('cements.index'));
    $this->assertDatabaseHas('cements', [
        'supplier_id' => null,
    ]);
    $cement = Cement::query()->whereNull('supplier_id')->first();
    expect($cement->date?->format('Y-m-d'))->toBe('2025-01-20')
        ->and((float) $cement->tons)->toBe(50.0);
});

test('formulario de edición de cemento se muestra', function () {
    $admin = User::factory()->create();
    $cement = Cement::factory()->create();

    $response = $this->actingAs($admin)->get(route('cements.edit', $cement));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('cement/edit')
        ->has('cement')
        ->has('suppliers')
        ->where('cement.id', $cement->id)
    );
});

test('se puede actualizar un registro de cemento', function () {
    $admin = User::factory()->create();
    $cement = Cement::factory()->create(['tons' => 80]);

    $response = $this->actingAs($admin)->put(route('cements.update', $cement), [
        'date' => $cement->date?->format('Y-m-d'),
        'tons' => 120,
        'supplier_id' => $cement->supplier_id,
    ]);

    $response->assertRedirect(route('cements.index'));
    $cement->refresh();
    expect($cement->tons)->toBe(120.0);
});

test('se puede eliminar un registro de cemento', function () {
    $admin = User::factory()->create();
    $cement = Cement::factory()->create();

    $response = $this->actingAs($admin)->delete(route('cements.destroy', $cement));

    $response->assertRedirect(route('cements.index'));
    $this->assertModelMissing($cement);
});
