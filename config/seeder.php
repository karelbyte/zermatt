<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Admin user (created by DatabaseSeeder)
    |--------------------------------------------------------------------------
    */

    'admin' => [
        'email' => env('SEEDER_ADMIN_EMAIL', 'admin@zermatt.com'),
        'password' => env('SEEDER_ADMIN_PASSWORD', '12345'),
    ],

];
