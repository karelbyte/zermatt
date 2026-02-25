<?php

namespace App\Http\Requests\ConcreteTypes;

use App\Models\ConcreteType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateConcreteTypeRequest extends FormRequest
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
        /** @var ConcreteType $concreteType */
        $concreteType = $this->route('concrete_type');

        return [
            'type' => ['required', 'string', 'max:5', Rule::unique('concrete_types', 'type')->ignore($concreteType->id)],
            'concept' => ['nullable', 'string', 'max:20'],
            'description' => ['nullable', 'string', 'max:30'],
            'active' => ['boolean'],
            'base_price' => ['nullable', 'numeric', 'min:0'],
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
            'base_price' => __('Precio base'),
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'active' => $this->boolean('active'),
        ]);
    }
}
