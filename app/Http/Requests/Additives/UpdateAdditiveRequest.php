<?php

namespace App\Http\Requests\Additives;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAdditiveRequest extends FormRequest
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
            'date' => ['nullable', 'date'],
            'lit' => ['nullable', 'numeric', 'min:0'],
            'supplier_id' => ['nullable', Rule::exists('suppliers', 'id')],
            'document' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['open', 'closed'])],
        ];
    }

    protected function prepareForValidation(): void
    {
        $supplierId = $this->input('supplier_id');
        $this->merge([
            'supplier_id' => $supplierId === '' || $supplierId === null ? null : (int) $supplierId,
        ]);
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'date' => __('Fecha'),
            'lit' => __('Litros'),
            'supplier_id' => __('Proveedor'),
            'document' => __('Documento'),
        ];
    }
}
