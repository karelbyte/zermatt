<?php

use App\Http\Controllers\AdditiveController;
use App\Http\Controllers\CementController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ConcreteTypeController;
use App\Http\Controllers\DesignController;
use App\Http\Controllers\MoistureAbsorptionController;
use App\Http\Controllers\OperatorController;
use App\Http\Controllers\PotController;
use App\Http\Controllers\RemissionController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UsageController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }

    return redirect()->route('login');
})->name('home');

Route::get('register', function () {
    return redirect()->route('login');
})->name('register');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('users', UserController::class)->except(['show']);
    Route::resource('clients', ClientController::class)->except(['show']);
    Route::resource('works', WorkController::class)->except(['show']);
    Route::resource('pots', PotController::class)->except(['show']);
    Route::resource('operators', OperatorController::class)->except(['show']);
    Route::resource('suppliers', SupplierController::class)->except(['show']);
    Route::resource('cements', CementController::class)->except(['show']);
    Route::resource('additives', AdditiveController::class)->except(['show']);
    Route::resource('concrete-types', ConcreteTypeController::class)->except(['show']);
    Route::resource('designs', DesignController::class)->except(['show']);
    Route::resource('usages', UsageController::class)->except(['show']);
    Route::resource('remissions', RemissionController::class)->except(['show']);
    Route::get('humedad-absorcion', [MoistureAbsorptionController::class, 'edit'])->name('moisture-absorption.edit');
    Route::put('humedad-absorcion', [MoistureAbsorptionController::class, 'update'])->name('moisture-absorption.update');
});

require __DIR__.'/settings.php';
