<?php

use Illuminate\Database\Migrations\Migration;

/**
 * Esta migración es un no-op: las columnas two_factor_* ya se crearon
 * directamente en la migración base de users (0001_01_01_000000_create_users_table).
 * Se mantiene el archivo para no romper el historial de migraciones de Fortify.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Las columnas two_factor_secret, two_factor_recovery_codes y
        // two_factor_confirmed_at ya existen en la tabla users.
        // No se requiere ninguna acción adicional.
    }

    public function down(): void
    {
        // No-op: no eliminamos columnas que son parte de la estructura base.
    }
};
