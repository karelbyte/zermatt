<?php

namespace App\Http\Requests\Designs;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDesignRequest extends FormRequest
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
            'concrete_type_id' => ['required', 'integer', Rule::exists('concrete_types', 'id')],
            'added' => ['nullable', 'integer', 'min:0'],
            'slump' => ['nullable', 'integer', 'min:0'],
            'fc' => ['nullable', 'integer', 'min:0'],
            'cement' => ['nullable', 'numeric', 'min:0'],
            'sand' => ['nullable', 'numeric', 'min:0'],
            'gravel' => ['nullable', 'numeric', 'min:0'],
            'water' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'concrete_type_id' => __('Tipo de concreto'),
            'added' => __('Added'),
            'slump' => __('Revenimiento'),
            'fc' => __('fc'),
            'cement' => __('Cemento'),
            'sand' => __('Arena'),
            'gravel' => __('Grava'),
            'water' => __('Agua'),
        ];
    }
}
