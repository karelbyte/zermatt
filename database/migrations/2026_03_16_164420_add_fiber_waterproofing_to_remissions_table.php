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
            $table->foreignId('fiber_id')->nullable()->constrained('fibers')->nullOnDelete();
            $table->double('fiber_quantity')->nullable();
            $table->foreignId('waterproofing_id')->nullable()->constrained('waterproofings')->nullOnDelete();
            $table->double('waterproofing_quantity')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('remissions', function (Blueprint $table) {
            $table->dropForeign(['fiber_id']);
            $table->dropColumn('fiber_id');
            $table->dropColumn('fiber_quantity');
            $table->dropForeign(['waterproofing_id']);
            $table->dropColumn('waterproofing_id');
            $table->dropColumn('waterproofing_quantity');
        });
    }
};
