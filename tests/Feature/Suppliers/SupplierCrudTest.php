<?php

use App\Models\Supplier;
use App\Models\User;

test('proveedores index se muestra a usuarios autenticados', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('suppliers.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('suppliers/index')
        ->has('suppliers')
        ->has('suppliers.data')
    );
});

test('formulario de creación de proveedor se muestra', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('suppliers.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('suppliers/create'));
});

test('se puede crear un proveedor', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->post(route('suppliers.store'), [
        'name' => 'Proveedor SA',
        'address' => 'Calle Principal 123',
        'phone' => '5551234567',
        'rfc' => 'ABC123456XYZ',
    ]);

    $response->assertRedirect(route('suppliers.index'));
    $this->assertDatabaseHas('suppliers', [
        'name' => 'Proveedor SA',
        'address' => 'Calle Principal 123',
        'phone' => '5551234567',
        'rfc' => 'ABC123456XYZ',
    ]);
});

test('formulario de edición de proveedor se muestra', function () {
    $admin = User::factory()->create();
    $supplier = Supplier::factory()->create();

    $response = $this->actingAs($admin)->get(route('suppliers.edit', $supplier));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('suppliers/edit')
        ->has('supplier')
        ->where('supplier.id', $supplier->id)
    );
});

test('se puede actualizar un proveedor', function () {
    $admin = User::factory()->create();
    $supplier = Supplier::factory()->create(['name' => 'Antiguo']);

    $response = $this->actingAs($admin)->put(route('suppliers.update', $supplier), [
        'name' => 'Proveedor Actualizado',
        'address' => $supplier->address,
        'phone' => $supplier->phone,
        'rfc' => $supplier->rfc,
    ]);

    $response->assertRedirect(route('suppliers.index'));
    $supplier->refresh();
    expect($supplier->name)->toBe('Proveedor Actualizado');
});

test('se puede eliminar un proveedor', function () {
    $admin = User::factory()->create();
    $supplier = Supplier::factory()->create();

    $response = $this->actingAs($admin)->delete(route('suppliers.destroy', $supplier));

    $response->assertRedirect(route('suppliers.index'));
    $this->assertModelMissing($supplier);
});
