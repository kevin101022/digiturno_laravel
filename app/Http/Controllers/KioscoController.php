<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Turn;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador del kiosco táctil público APE.
 *
 * Flujo:
 *   GET  /kiosco        → Muestra el wizard React (3 pasos).
 *   POST /kiosco/turno  → Busca/crea usuario ciudadano y genera su turno.
 */
final class KioscoController extends Controller
{
    /** Mapa de categoría UI → queue_type de la tabla turns. */
    private const QUEUE_MAP = [
        'victim'   => 'victim',
        'priority' => 'general',
        'business' => 'general',
        'general'  => 'general',
    ];

    /** Prefijos de código según categoría. */
    private const PREFIX_MAP = [
        'victim'   => 'V',
        'priority' => 'P',
        'business' => 'E',   // E = Empresario
        'general'  => 'G',
    ];

    /** Muestra la página del kiosco (wizard React, sin autenticación). */
    public function index(): Response
    {
        return Inertia::render('kiosco/index');
    }

    /**
     * Genera un turno para el ciudadano.
     *
     * Parámetros esperados:
     *   - categoria        : victim | priority | business | general
     *   - tipo_documento   : CC | CE | TI
     *   - numero_documento : string (mín. 5 dígitos)
     *
     * Retorna a la misma página con flash prop `turno` que contiene
     * { turn_code, categoria, queue_type }.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'categoria'        => ['required', 'in:victim,priority,business,general'],
            'tipo_documento'   => ['required', 'in:CC,TI,CE,PPT,PA'],
            'numero_documento' => ['required', 'string', function ($attribute, $value, $fail) use ($request) {
                // Remover puntos si vienen (por si acaso el teclado físico los envía)
                $value = str_replace('.', '', $value);
                
                $tipo = $request->input('tipo_documento');
                $isValid = match ($tipo) {
                    'CC' => preg_match('/^[0-9]{5,10}$/', $value),
                    'TI' => preg_match('/^[0-9]{10,11}$/', $value),
                    'CE', 'PPT' => preg_match('/^[0-9]{6,8}$/', $value),
                    'PA' => preg_match('/^[A-Za-z0-9]{6,16}$/', $value),
                    default => false,
                };
                
                if (!$isValid) {
                    $fail("La longitud o el formato del documento no son válidos para $tipo.");
                }
            }],
        ]);

        // Asegurar que guardamos sin puntos
        $validated['numero_documento'] = str_replace('.', '', $validated['numero_documento']);
        
        // Convertir a mayúsculas para pasaportes
        $validated['numero_documento'] = strtoupper($validated['numero_documento']);


        $turno = DB::transaction(function () use ($validated): Turn {
            $usuario = $this->buscarOCrearCiudadano(
                $validated['tipo_documento'],
                $validated['numero_documento'],
            );

            $nuevoTurno = $this->crearTurno($usuario->id, $validated['categoria']);

            return $nuevoTurno;
        });

        return to_route('kiosco.index')->with('turno', [
            'turn_code'  => $turno->turn_code,
            'categoria'  => $validated['categoria'],
            'queue_type' => $turno->queue_type,
            'documento'  => $turno->user->document_number,
            'nombre'     => $turno->user->name,
        ]);
    }

    // ── Métodos privados ────────────────────────────────────────────────

    /**
     * Busca un usuario ciudadano por número de documento.
     * Si no existe, lo crea con role_id 3 (client) y datos mínimos.
     */
    private function buscarOCrearCiudadano(string $tipoDoc, string $numeroDoc): User
    {
        return User::firstOrCreate(
            ['document_number' => $numeroDoc],
            [
                'role_id'       => 3,  // client
                'document_type' => $tipoDoc,
                'name'          => "Ciudadano {$numeroDoc}",
            ],
        );
    }

    /**
     * Crea el turno del día con un código único correlativo.
     * Formato: {PREFIJO}-{número secuencial del día}, ej. G-042.
     */
    private function crearTurno(int $userId, string $categoria): Turn
    {
        $prefix    = self::PREFIX_MAP[$categoria];
        $queueType = self::QUEUE_MAP[$categoria];

        $turnoNum  = $this->siguienteNumeroTurno($prefix);
        $turnCode  = "{$prefix}-" . str_pad((string) $turnoNum, 3, '0', STR_PAD_LEFT);

        return Turn::create([
            'user_id'      => $userId,
            'turn_code'    => $turnCode,
            'category'     => $this->mapearCategoria($categoria),
            'queue_type'   => $queueType,
            'status'       => 'waiting',
            'generated_at' => now(),
        ]);
    }

    /**
     * Calcula el siguiente número secuencial del día para el prefijo dado.
     * Reinicia cada jornada (filtra por created_at del día actual).
     */
    private function siguienteNumeroTurno(string $prefix): int
    {
        $ultimo = Turn::whereDate('created_at', today())
            ->where('turn_code', 'like', "{$prefix}-%")
            ->count();

        return $ultimo + 1;
    }

    /**
     * Convierte la categoría UI al enum de la columna `category` en turns.
     * victim → victim | priority | business | general → general/special
     */
    private function mapearCategoria(string $categoria): string
    {
        return match ($categoria) {
            'victim'   => 'victim',
            'priority' => 'special',
            default    => 'general',
        };
    }
}
