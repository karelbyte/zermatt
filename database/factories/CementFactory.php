<?php

namespace Database\Factories;

use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cement>
 */
class CementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date' => fake()->dateTimeBetween('-1 year'),
            'tons' => fake()->randomFloat(2, 1, 500),
            'supplier_id' => Supplier::factory(),
            'document' => fake()->optional(0.7)->regexify('[A-Z0-9]{5,20}'),
        ];
    }

    public function withoutSupplier(): static
    {
        return $this->state(fn (array $attributes) => [
            'supplier_id' => null,
        ]);
    }
}
