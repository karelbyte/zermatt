<?php

namespace App\Http\Requests\Fibers;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFiberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'lit' => ['required', 'numeric', 'min:0'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'document' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:open,closed'],
        ];
    }
}
