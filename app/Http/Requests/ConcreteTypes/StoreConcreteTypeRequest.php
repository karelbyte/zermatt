<?php

namespace App\Http\Requests\ConcreteTypes;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreConcreteTypeRequest extends FormRequest
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
            'type' => ['required', 'string', 'max:5', Rule::unique('concrete_types', 'type')],
            'concept' => ['nullable', 'string', 'max:20'],
            'description' => ['nullable', 'string', 'max:30'],
            'active' => ['boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'type' => __('Tipo'),
            'concept' => __('Concepto'),
            'description' => __('Descripción'),
            'active' => __('Activo'),
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'active' => $this->boolean('active'),
        ]);
    }
}
