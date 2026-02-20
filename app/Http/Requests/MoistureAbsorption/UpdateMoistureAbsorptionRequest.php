<?php

namespace App\Http\Requests\MoistureAbsorption;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMoistureAbsorptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'humidity_gravel' => ['nullable', 'numeric', 'min:0'],
            'humidity_sand' => ['nullable', 'numeric', 'min:0'],
            'absorption_gravel' => ['nullable', 'numeric', 'min:0'],
            'absorption_sand' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'humidity_gravel' => __('Humedad grava'),
            'humidity_sand' => __('Humedad arena'),
            'absorption_gravel' => __('Absorción grava'),
            'absorption_sand' => __('Absorción arena'),
        ];
    }
}
