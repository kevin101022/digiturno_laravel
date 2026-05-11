<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── advisor_types ─────────────────────────────────────────────────
        Schema::create('advisor_types', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique();
            $table->timestamps();
        });

        // ── advisor_details ───────────────────────────────────────────────
        Schema::create('advisor_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->foreignId('advisor_type_id')->constrained('advisor_types');
            $table->string('module_number', 20);
            $table->enum('module_type', ['general', 'victim'])->default('general');
            $table->enum('shift', ['morning', 'afternoon'])->nullable();
            $table->enum('availability_status', ['green', 'yellow', 'red'])->default('green');
            $table->timestamps();
        });

        // ── turns ─────────────────────────────────────────────────────────
        Schema::create('turns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('turn_code', 15)->unique();
            $table->enum('category', ['victim', 'general', 'special']);
            $table->enum('queue_type', ['general', 'victim']);
            $table->enum('status', ['waiting', 'called', 'attending', 'completed', 'absent'])
                  ->default('waiting');
            $table->dateTime('generated_at')->nullable();
            $table->boolean('ticket_printed')->default(false);
            $table->boolean('ticket_print_failed')->default(false);
            $table->timestamps();

            $table->index(['queue_type', 'status'], 'turns_queue_type_status_index');
        });

        // ── attendances ───────────────────────────────────────────────────
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('turn_id')->constrained('turns')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users');
            $table->dateTime('started_at');
            $table->dateTime('ended_at')->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->boolean('absent')->default(false);
            $table->text('observations')->nullable();
            $table->timestamps();
        });

        // ── pauses ────────────────────────────────────────────────────────
        Schema::create('pauses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('reason', 100);
            $table->dateTime('started_at');
            $table->dateTime('ended_at')->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->boolean('alert_triggered')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pauses');
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('turns');
        Schema::dropIfExists('advisor_details');
        Schema::dropIfExists('advisor_types');
    }
};
