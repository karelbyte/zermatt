<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $adminEmail = config('seeder.admin.email', 'admin@zermattconcretos.com');
        $adminPassword = config('seeder.admin.password', '12345');

        User::query()->firstOrCreate(
            ['email' => $adminEmail],
            [
                'name' => 'Admin',
                'password' => Hash::make($adminPassword),
                'email_verified_at' => now(),
                'is_active' => true,
                'is_admin' => true,
            ]
        );
    }
}
