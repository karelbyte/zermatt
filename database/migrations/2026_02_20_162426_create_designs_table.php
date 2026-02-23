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
        Schema::create('designs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('concrete_type_id')->constrained('concrete_types')->cascadeOnDelete();
            $table->integer('added')->nullable();
            $table->integer('slump')->nullable();
            $table->integer('fc')->nullable();
            $table->double('cement')->nullable();
            $table->double('sand')->nullable();
            $table->double('gravel')->nullable();
            $table->double('water')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('designs');
    }
};
