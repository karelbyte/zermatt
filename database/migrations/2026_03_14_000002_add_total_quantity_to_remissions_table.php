<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('remissions', function (Blueprint $table) {
            $table->decimal('total_quantity', 10, 2)->nullable()->after('quantity');
        });

        // Best-effort backfill for existing rows: total = delivered + pending.
        DB::table('remissions')->update([
            'total_quantity' => DB::raw('COALESCE(quantity, 0) + COALESCE(pending_delivery, 0)'),
        ]);
    }

    public function down(): void
    {
        Schema::table('remissions', function (Blueprint $table) {
            $table->dropColumn('total_quantity');
        });
    }
};

