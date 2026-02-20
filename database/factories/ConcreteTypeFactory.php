<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ConcreteType>
 */
class ConcreteTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => strtoupper(fake()->unique()->regexify('[A-Z0-9]{3,5}')),
            'concept' => fake()->optional(0.8)->passthrough(Str::limit(fake()->words(2, true), 20)),
            'description' => fake()->optional(0.7)->passthrough(Str::limit(fake()->words(4, true), 30)),
            'active' => fake()->boolean(80),
        ];
    }
}
