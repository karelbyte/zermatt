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

use App\Services\AdditiveService;
use App\Services\CementService;

use App\Models\Client;
use App\Models\Work;
use App\Models\Remission;
use App\Models\Supplier;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (AdditiveService $additiveService, CementService $cementService) {
        return Inertia::render('dashboard', [
            'total_additives' => $additiveService->getTotalLiters(),
            'total_cement' => $cementService->getTotalKg(),
            'count_clients' => Client::count(),
            'count_works' => Work::count(),
            'count_remissions' => Remission::count(),
            'count_suppliers' => Supplier::count(),
            'recent_remissions' => Remission::with(['client:id,name', 'work:id,name'])
                ->orderByDesc('created_at')
                ->limit(10)
                ->get(),
        ]);
    })->middleware(['permission:Panel'])->name('dashboard');

    Route::resource('users', UserController::class)->except(['show'])->middleware('permission:Usuarios');
    Route::resource('clients', ClientController::class)->except(['show'])->middleware('permission:Clientes');
    Route::resource('works', WorkController::class)->except(['show'])->middleware('permission:Obras');
    Route::resource('pots', PotController::class)->except(['show'])->middleware('permission:Ollas');
    Route::resource('operators', OperatorController::class)->except(['show'])->middleware('permission:Operadores');
    Route::resource('suppliers', SupplierController::class)->except(['show'])->middleware('permission:Proveedores');
    Route::resource('cements', CementController::class)->except(['show'])->middleware('permission:Cemento');
    Route::resource('additives', AdditiveController::class)->except(['show'])->middleware('permission:Aditivos');
    Route::resource('concrete-types', ConcreteTypeController::class)->except(['show'])->middleware('permission:Tipos de Concretos');
    Route::resource('designs', DesignController::class)->except(['show'])->middleware('permission:Diseños');
    Route::resource('usages', UsageController::class)->except(['show'])->middleware('permission:Usos');
    Route::resource('remissions', RemissionController::class)->except(['show'])->middleware('permission:Remisiones');
    Route::get('remissions/{remission}/print', [RemissionController::class, 'print'])->name('remissions.print')->middleware('permission:Remisiones');

    Route::get('humedad-absorcion', [MoistureAbsorptionController::class, 'edit'])->name('moisture-absorption.edit')->middleware('permission:Tipos de Concretos');
    Route::put('humedad-absorcion', [MoistureAbsorptionController::class, 'update'])->name('moisture-absorption.update')->middleware('permission:Tipos de Concretos');
});

require __DIR__ . '/settings.php';
