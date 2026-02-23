<?php

namespace Database\Factories;

use App\Models\ConcreteType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Design>
 */
class DesignFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'concrete_type_id' => ConcreteType::factory(),
            'added' => fake()->optional(0.7)->numberBetween(0, 500),
            'slump' => fake()->optional(0.7)->numberBetween(0, 200),
            'fc' => fake()->numberBetween(150, 400),
            'cement' => fake()->randomFloat(2, 1, 100),
            'sand' => fake()->randomFloat(2, 1, 200),
            'gravel' => fake()->randomFloat(2, 1, 200),
            'water' => fake()->randomFloat(2, 0.1, 50),
        ];
    }
}
