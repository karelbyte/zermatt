<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('moisture_absorption_settings', function (Blueprint $table) {
            $table->id();
            $table->decimal('humidity_gravel', 10, 4)->nullable();
            $table->decimal('humidity_sand', 10, 4)->nullable();
            $table->decimal('absorption_gravel', 10, 4)->nullable();
            $table->decimal('absorption_sand', 10, 4)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('moisture_absorption_settings');
    }
};
