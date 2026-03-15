<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('remissions', function (Blueprint $table) {
            $table->uuid('delivery_group_id')->nullable()->after('id')->index();
            $table->decimal('initial_total_quantity', 10, 2)->nullable()->after('total_quantity');
        });
    }

    public function down(): void
    {
        Schema::table('remissions', function (Blueprint $table) {
            $table->dropColumn(['delivery_group_id', 'initial_total_quantity']);
        });
    }
};

