<?php

use App\Http\Controllers\KioscoController;
use App\Http\Controllers\AsesorController;
use App\Http\Controllers\CoordinadorController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');


// ── Kiosco táctil — atril público, sin autenticación ────────────────────
Route::prefix('kiosco')->name('kiosco.')->group(function () {
    Route::get('/', [KioscoController::class, 'index'])->name('index');
    Route::post('/turno', [KioscoController::class, 'store'])->name('turno.store');
    Route::inertia('/feedback', 'kiosco/feedback')->name('feedback');
});

// Panel del Asesor
Route::get('/asesor', [AsesorController::class, 'index'])->name('asesor.index');

// Portal del Coordinador
Route::get('/coordinador', [CoordinadorController::class, 'index'])->name('coordinador.index');



Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
