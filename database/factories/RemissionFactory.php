<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\ConcreteType;
use App\Models\Operator;
use App\Models\Pot;
use App\Models\Usage;
use App\Models\Work;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Remission>
 */
class RemissionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $client = Client::factory()->create();
        $work = Work::factory()->create(['client_id' => $client->id]);

        return [
            'order_number' => fake()->optional(0.7)->numberBetween(1, 99999),
            'client_id' => $client->id,
            'work_id' => $work->id,
            'usage_id' => Usage::factory(),
            'fc' => fake()->optional(0.6)->numberBetween(150, 400),
            'concrete_type_id' => ConcreteType::factory(),
            'concept' => fake()->optional(0.5)->words(3, true),
            'added' => fake()->optional(0.4)->numberBetween(0, 100),
            'slump' => fake()->optional(0.4)->numberBetween(5, 25),
            'pump' => fake()->boolean(30),
            'impermeable' => fake()->boolean(20),
            'fiber' => fake()->boolean(20),
            'quantity' => fake()->optional(0.8)->randomFloat(2, 1, 100),
            'specification' => fake()->optional(0.5)->sentence(),
            'product' => fake()->optional(0.5)->words(2, true),
            'observations' => fake()->optional(0.4)->paragraph(),
            'departure_date' => fake()->optional(0.6)->dateTimeBetween('now', '+1 month'),
            'pot_id' => Pot::factory(),
            'operator_id' => Operator::factory(),
            'cement_amount' => fake()->optional(0.5)->numberBetween(1, 500),
            'additive_amount' => fake()->optional(0.5)->randomFloat(2, 0, 50),
            'fiber_amount' => fake()->optional(0.5)->randomFloat(2, 0, 20),
            'gravel' => fake()->optional(0.5)->randomFloat(2, 0, 200),
            'sand' => fake()->optional(0.5)->randomFloat(2, 0, 200),
            'water' => fake()->optional(0.5)->randomFloat(2, 0, 50),
            'tp' => fake()->optional(0.4)->lexify('TP-???'),
            'invoice' => fake()->optional(0.5)->numerify('FAC-####'),
        ];
    }
}
