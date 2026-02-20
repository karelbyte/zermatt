<?php

use App\Models\User;

test('register url redirects to login', function () {
    $response = $this->get(route('register'));

    $response->assertRedirect(route('login'));
});

test('guest is redirected to login when visiting home', function () {
    $response = $this->get(route('home'));

    $response->assertRedirect(route('login'));
});

test('authenticated user is redirected to dashboard when visiting home', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('home'));

    $response->assertRedirect(route('dashboard'));
});
