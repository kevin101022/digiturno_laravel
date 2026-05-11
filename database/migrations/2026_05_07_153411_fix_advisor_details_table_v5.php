<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('advisor_details', function (Blueprint $table) {
            if (!Schema::hasColumn('advisor_details', 'module_number')) {
                $table->string('module_number', 20)->after('advisor_type_id');
            }
            if (!Schema::hasColumn('advisor_details', 'module_type')) {
                $table->enum('module_type', ['general', 'victim'])->default('general')->after('module_number');
            }
            if (!Schema::hasColumn('advisor_details', 'shift')) {
                $table->enum('shift', ['morning', 'afternoon'])->nullable()->after('module_type');
            }
            if (!Schema::hasColumn('advisor_details', 'availability_status')) {
                $table->enum('availability_status', ['green', 'yellow', 'red'])->default('green')->after('shift');
            }
        });
    }

    public function down(): void
    {
        Schema::table('advisor_details', function (Blueprint $table) {
            $table->dropColumn(['module_number', 'module_type', 'shift', 'availability_status']);
        });
    }
};
