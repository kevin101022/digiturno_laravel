<?php

use App\Http\Controllers\KioscoController;
use App\Http\Controllers\AsesorController;
use App\Http\Controllers\CoordinadorController;
use App\Http\Controllers\DisplayController;
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

// ── Pantalla de Visualización (TV) ──────────────────────────────────────
Route::get('/pantalla', [DisplayController::class, 'index'])->name('pantalla.index');

// ── Panel del Asesor — Operación de turnos ──────────────────────────────
Route::middleware(['auth'])->prefix('asesor')->name('asesor.')->group(function () {
    Route::get('/', [AsesorController::class, 'index'])->name('index');
    
    // API interna para el panel (Inertia/XHR)
    Route::get('/turnos-en-espera', [AsesorController::class, 'turnosEnEspera'])->name('turnosEnEspera');
    Route::get('/historial', [AsesorController::class, 'historial'])->name('historial');
    Route::post('/aceptar/{turnId}', [AsesorController::class, 'aceptarTurno'])->name('aceptar');
    Route::get('/consultar', [AsesorController::class, 'consultarAsignacion'])->name('consultar');
    Route::post('/estado', [AsesorController::class, 'actualizarEstado'])->name('estado');
    Route::post('/iniciar/{turnId}', [AsesorController::class, 'iniciarAtencion'])->name('iniciar');
    Route::post('/finalizar/{turnId}', [AsesorController::class, 'finalizarAtencion'])->name('finalizar');
    Route::post('/ausente/{turnId}', [AsesorController::class, 'marcarAusente'])->name('ausente');
    Route::post('/rellamar/{turnId}', [AsesorController::class, 'reLlamar'])->name('rellamar');
    Route::post('/pausa', [AsesorController::class, 'gestionarPausa'])->name('pausa');
});

// Portal del Coordinador
Route::get('/coordinador', [CoordinadorController::class, 'index'])->name('coordinador.index');



Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
