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
        Schema::table('remissions', function (Blueprint $table) {
            $table->decimal('waterproofing_amount', 10, 2)->nullable();
            $table->dropForeign(['fiber_id']);
            $table->dropColumn('fiber_id');
            $table->dropColumn('fiber_quantity');
            $table->dropForeign(['waterproofing_id']);
            $table->dropColumn('waterproofing_id');
            $table->dropColumn('waterproofing_quantity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('remissions', function (Blueprint $table) {
            $table->dropColumn('waterproofing_amount');
            $table->foreignId('fiber_id')->nullable()->constrained('fibers')->nullOnDelete();
            $table->decimal('fiber_quantity', 10, 2)->nullable();
            $table->foreignId('waterproofing_id')->nullable()->constrained('waterproofings')->nullOnDelete();
            $table->decimal('waterproofing_quantity', 10, 2)->nullable();
        });
    }
};
