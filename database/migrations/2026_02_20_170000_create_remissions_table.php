<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('remissions', function (Blueprint $table) {
            $table->id();
            $table->integer('order_number')->nullable();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->foreignId('work_id')->constrained('works')->cascadeOnDelete();
            $table->foreignId('usage_id')->nullable()->constrained('usages')->nullOnDelete();
            $table->integer('fc')->nullable();
            $table->foreignId('concrete_type_id')->nullable()->constrained('concrete_types')->nullOnDelete();
            $table->string('concept')->nullable();
            $table->integer('added')->nullable();
            $table->integer('slump')->nullable();
            $table->boolean('pump')->default(false);
            $table->boolean('impermeable')->default(false);
            $table->boolean('fiber')->default(false);
            $table->decimal('quantity', 10, 2)->nullable();
            $table->string('specification')->nullable();
            $table->string('product')->nullable();
            $table->text('observations')->nullable();
            $table->string('departure_date', 50)->nullable();
            $table->foreignId('pot_id')->nullable()->constrained('pots')->nullOnDelete();
            $table->foreignId('operator_id')->nullable()->constrained('operators')->nullOnDelete();
            $table->integer('cement_amount')->nullable();
            $table->decimal('additive_amount', 10, 2)->nullable();
            $table->decimal('fiber_amount', 10, 2)->nullable();
            $table->decimal('gravel', 10, 2)->nullable();
            $table->decimal('sand', 10, 2)->nullable();
            $table->decimal('water', 10, 2)->nullable();
            $table->string('tp')->nullable();
            $table->string('invoice')->nullable();
            $table->decimal('unit_price', 15, 2)->nullable();
            $table->decimal('subtotal', 15, 2)->nullable();
            $table->decimal('iva', 15, 2)->nullable();
            $table->decimal('total', 15, 2)->nullable();
            $table->integer('iva_percentage')->default(16);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remissions');
    }
};
