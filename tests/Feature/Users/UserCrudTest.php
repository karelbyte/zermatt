<?php

use App\Models\User;

test('usuarios index se muestra a usuarios autenticados', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('users.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('users/index')
        ->has('users')
        ->has('users.data')
    );
});

test('formulario de creación de usuario se muestra', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('users.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('users/create'));
});

test('se puede crear un usuario', function () {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->post(route('users.store'), [
        'name' => 'Nuevo Usuario',
        'email' => 'nuevo@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'is_active' => true,
    ]);

    $response->assertRedirect(route('users.index'));
    $this->assertDatabaseHas('users', [
        'email' => 'nuevo@example.com',
        'name' => 'Nuevo Usuario',
        'is_active' => true,
    ]);
});

test('formulario de edición de usuario se muestra', function () {
    $admin = User::factory()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($admin)->get(route('users.edit', $user));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('users/edit')
        ->has('user')
        ->where('user.id', $user->id)
    );
});

test('se puede actualizar un usuario', function () {
    $admin = User::factory()->create();
    $user = User::factory()->create(['name' => 'Antiguo']);

    $response = $this->actingAs($admin)->put(route('users.update', $user), [
        'name' => 'Nombre Actualizado',
        'email' => $user->email,
        'is_active' => false,
    ]);

    $response->assertRedirect(route('users.index'));
    $user->refresh();
    expect($user->name)->toBe('Nombre Actualizado')
        ->and($user->is_active)->toBeFalse();
});

test('se puede eliminar un usuario', function () {
    $admin = User::factory()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($admin)->delete(route('users.destroy', $user));

    $response->assertRedirect(route('users.index'));
    $this->assertModelMissing($user);
});
