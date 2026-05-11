<?php

namespace Database\Seeders;

use App\Models\AlertThreshold;
use App\Models\Role;
use App\Models\AdvisorType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Roles ────────────────────────────────────────────────────────
        $coordinator = Role::create(['name' => 'coordinator']);
        $advisor     = Role::create(['name' => 'advisor']);
        $client      = Role::create(['name' => 'client']);

        // ── Tipos de asesor ──────────────────────────────────────────────
        AdvisorType::create(['name' => 'victim_population']);
        AdvisorType::create(['name' => 'general_public']);

        // ── Umbrales de alerta (valores por defecto del SQL) ─────────────
        $thresholds = [
            [
                'key'           => 'saturation_yellow',
                'value'         => 5.00,
                'default_value' => 5.00,
                'description'   => 'Ratio mínimo (turnos_espera/asesores_activos) para semáforo amarillo',
            ],
            [
                'key'           => 'saturation_red',
                'value'         => 10.00,
                'default_value' => 10.00,
                'description'   => 'Ratio mínimo para semáforo rojo',
            ],
            [
                'key'           => 'max_pause_minutes',
                'value'         => 15.00,
                'default_value' => 15.00,
                'description'   => 'Minutos máximos de pausa de un asesor antes de alertar al coordinador',
            ],
            [
                'key'           => 'tee_courtesy_minutes',
                'value'         => 30.00,
                'default_value' => 30.00,
                'description'   => 'TEE en minutos a partir del cual se muestra mensaje de cortesía en el kiosco',
            ],
            [
                'key'           => 'queue_trend_periods',
                'value'         => 3.00,
                'default_value' => 3.00,
                'description'   => 'Períodos consecutivos con cola creciente para activar alerta de tendencia',
            ],
        ];

        foreach ($thresholds as $threshold) {
            AlertThreshold::create($threshold);
        }

        // ── Usuario coordinador de prueba ────────────────────────────────
        User::create([
            'role_id'         => $coordinator->id,
            'document_type'   => 'CC',
            'document_number' => '1000000001',
            'first_name'      => 'Admin',
            'last_name'       => 'APE',
            'name'            => 'Admin APE',
            'email'           => 'admin@ape.gov.co',
            'password'        => Hash::make('password'),
        ]);

        // ── Usuario asesor de prueba ─────────────────────────────────────
        $advisorUser = User::create([
            'role_id'         => $advisor->id,
            'document_type'   => 'CC',
            'document_number' => '1000000002',
            'first_name'      => 'Asesor',
            'last_name'       => 'Prueba',
            'name'            => 'Asesor Prueba',
            'email'           => 'asesor@ape.gov.co',
            'password'        => Hash::make('password'),
        ]);

        // Detalles del asesor: Especialidad Público General
        \App\Models\AdvisorDetail::create([
            'user_id'         => $advisorUser->id,
            'advisor_type_id' => 2, // general_public
            'module_number'   => '1',
        ]);

        // Asignación de módulo: Módulo 1
        \App\Models\ModuleAssignment::create([
            'module_number' => '1',
            'module_type'   => 'general',
            'advisor_id'    => $advisorUser->id,
            'shift'         => 'morning',
            'date'          => today(),
            'assigned_by'   => $advisorUser->id, // Se auto-asigna para el ejemplo
        ]);
    }
}
