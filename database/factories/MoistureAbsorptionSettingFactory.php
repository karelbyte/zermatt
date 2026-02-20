<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MoistureAbsorptionSetting>
 */
class MoistureAbsorptionSettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'humidity_gravel' => fake()->randomFloat(4, 0, 10),
            'humidity_sand' => fake()->randomFloat(4, 0, 10),
            'absorption_gravel' => fake()->randomFloat(4, 0, 5),
            'absorption_sand' => fake()->randomFloat(4, 0, 5),
        ];
    }
}
