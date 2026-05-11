<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── feedbacks ─────────────────────────────────────────────────────
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attendance_id')->constrained('attendances')->cascadeOnDelete();
            $table->foreignId('turn_id')->unique()->constrained('turns')->cascadeOnDelete();
            $table->foreignId('advisor_id')->constrained('users')->cascadeOnDelete();
            $table->string('document_number', 30);
            $table->date('session_date');
            $table->unsignedTinyInteger('rating');
            $table->dateTime('rated_at');
            $table->timestamps();

            $table->index('session_date', 'feedbacks_session_date_index');
        });

        // ── alert_thresholds ──────────────────────────────────────────────
        Schema::create('alert_thresholds', function (Blueprint $table) {
            $table->id();
            $table->string('key', 60)->unique();
            $table->decimal('value', 10, 2);
            $table->decimal('default_value', 10, 2);
            $table->string('description', 200)->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // ── saturation_logs ───────────────────────────────────────────────
        Schema::create('saturation_logs', function (Blueprint $table) {
            $table->id();
            $table->enum('queue_type', ['general', 'victim']);
            $table->decimal('saturation_ratio', 6, 2);
            $table->unsignedSmallInteger('waiting_count')->default(0);
            $table->unsignedTinyInteger('active_advisors')->default(0);
            $table->decimal('arrival_rate', 6, 2)->nullable();
            $table->decimal('departure_rate', 6, 2)->nullable();
            $table->enum('level', ['green', 'yellow', 'red']);
            $table->string('suggestion', 200)->nullable();
            $table->timestamp('logged_at')->useCurrent();

            $table->primary('id');
            $table->index(['queue_type', 'logged_at'], 'saturation_logs_queue_logged_index');
        });

        // ── module_assignments ────────────────────────────────────────────
        Schema::create('module_assignments', function (Blueprint $table) {
            $table->id();
            $table->string('module_number', 20);
            $table->enum('module_type', ['general', 'victim']);
            $table->foreignId('advisor_id')->constrained('users')->cascadeOnDelete();
            $table->enum('shift', ['morning', 'afternoon']);
            $table->date('date');
            $table->foreignId('assigned_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['advisor_id', 'shift', 'date'], 'unique_advisor_shift_date');
            $table->unique(['module_number', 'shift', 'date'], 'unique_module_shift_date');
        });

        // ── display_events ─────────────────────────────────────────────────
        Schema::create('display_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('turn_id')->constrained('turns')->cascadeOnDelete();
            $table->foreignId('advisor_id')->constrained('users')->cascadeOnDelete();
            $table->string('module_number', 20);
            $table->enum('event_type', ['called', 'recalled', 'attending', 'completed']);
            $table->boolean('screen_lost')->default(false);
            $table->timestamp('created_at')->useCurrent();

            $table->index(['turn_id', 'created_at'], 'display_events_turn_id_created_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('display_events');
        Schema::dropIfExists('module_assignments');
        Schema::dropIfExists('saturation_logs');
        Schema::dropIfExists('alert_thresholds');
        Schema::dropIfExists('feedbacks');
    }
};
