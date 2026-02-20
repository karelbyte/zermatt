<?php

namespace App\Http\Requests\Ollas;

use App\Models\Olla;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOllaRequest extends FormRequest
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
        /** @var Olla $olla */
        $olla = $this->route('olla');

        return [
            'number' => ['required', 'string', 'max:10', Rule::unique('ollas', 'number')->ignore($olla->id)],
            'capacity' => ['nullable', 'numeric', 'min:0'],
            'active' => ['boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'number' => __('Número'),
            'capacity' => __('Capacidad'),
            'active' => __('Activa'),
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'active' => $this->boolean('active'),
        ]);
    }
}
