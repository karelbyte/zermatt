<?php

namespace App\Http\Requests\Pots;

use App\Models\Pot;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePotRequest extends FormRequest
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
        /** @var Pot $pot */
        $pot = $this->route('pot');

        return [
            'number' => ['required', 'string', 'max:10', Rule::unique('pots', 'number')->ignore($pot->id)],
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
            'number' => __('Number'),
            'capacity' => __('Capacity'),
            'active' => __('Active'),
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'active' => $this->boolean('active'),
        ]);
    }
}
