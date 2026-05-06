<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AsesorController extends Controller
{
    /**
     * Muestra la interfaz principal del asesor.
     */
    public function index()
    {
        return Inertia::render('asesor/index', [
            'stats' => [
                'atendidos_hoy' => 12,
                'tiempo_promedio' => '08:45',
                'en_espera' => 24,
            ],
            'asesor' => [
                'nombre' => 'Carlos Rodriguez',
                'modulo' => 'Ventanilla 04',
                'avatar' => 'https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=050066&color=fff',
            ]
        ]);
    }
}
