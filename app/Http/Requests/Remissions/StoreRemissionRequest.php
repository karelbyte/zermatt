<?php

namespace App\Http\Requests\Remissions;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRemissionRequest extends FormRequest
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
            'order_number' => ['nullable', 'integer', 'min:1'],
            'remision' => ['nullable', 'string', 'max:255'],
            'client_id' => ['required', 'integer', Rule::exists('clients', 'id')],
            'work_id' => ['required', 'integer', Rule::exists('works', 'id')],
            'usage_id' => ['nullable', 'integer', Rule::exists('usages', 'id')],
            'fc' => ['nullable', 'integer', 'min:0'],
            'concrete_type_id' => ['nullable', 'integer', Rule::exists('concrete_types', 'id')],
            'concept' => ['nullable', 'string', 'max:255'],
            'added' => ['nullable', 'integer', 'min:0'],
            'slump' => ['nullable', 'integer', 'min:0'],
            'pump' => ['boolean'],
            'impermeable' => ['boolean'],
            'fiber' => ['boolean'],
            'quantity' => ['nullable', 'numeric', 'min:0'],
            'total_quantity' => ['nullable', 'numeric', 'min:0'],
            'pending_delivery' => ['nullable', 'numeric', 'min:0'],
            'specification' => ['nullable', 'string', 'max:500'],
            'product' => ['nullable', 'string', 'max:255'],
            'observations' => ['nullable', 'string', 'max:2000'],
            'departure_date' => ['nullable', 'string'],
            'pot_id' => ['nullable', 'integer', Rule::exists('pots', 'id')],
            'operator_id' => ['nullable', 'integer', Rule::exists('operators', 'id')],
            'cement_amount' => ['nullable', 'integer', 'min:0'],
            'additive_amount' => ['nullable', 'numeric', 'min:0'],
            'fiber_amount' => ['nullable', 'numeric', 'min:0'],
            'waterproofing_amount' => ['nullable', 'numeric', 'min:0'],
            'gravel' => ['nullable', 'numeric', 'min:0'],
            'sand' => ['nullable', 'numeric', 'min:0'],
            'water' => ['nullable', 'numeric', 'min:0'],
            'tp' => ['nullable', 'string', 'max:100'],
            'invoice' => ['nullable', 'string', 'max:255'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $merge = [
            'pump' => $this->boolean('pump'),
            'impermeable' => $this->boolean('impermeable'),
            'fiber' => $this->boolean('fiber'),
        ];
        $nullableFks = ['usage_id', 'concrete_type_id', 'pot_id', 'operator_id'];
        foreach (['client_id', 'work_id', 'usage_id', 'concrete_type_id', 'pot_id', 'operator_id'] as $key) {
            $v = $this->input($key);
            if ($v === '' && in_array($key, $nullableFks, true)) {
                $merge[$key] = null;
            } elseif ($v !== '' && $v !== null) {
                $merge[$key] = (int) $v;
            }
        }
        $this->merge($merge);
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'order_number' => __('Order number'),
            'remision' => __('Remisión'),
            'client_id' => __('Cliente'),
            'work_id' => __('Obra'),
            'usage_id' => __('Uso'),
            'fc' => __('fc'),
            'concrete_type_id' => __('Tipo de concreto'),
            'concept' => __('Concepto'),
            'added' => __('Added'),
            'slump' => __('Revenimiento'),
            'pump' => __('Bomba'),
            'impermeable' => __('Imper'),
            'fiber' => __('Fibra'),
            'quantity' => __('Cantidad'),
            'total_quantity' => __('Cantidad total a surtir'),
            'pending_delivery' => __('Pendiente de entrega'),
            'specification' => __('Especificación'),
            'product' => __('Producto'),
            'observations' => __('Observaciones'),
            'departure_date' => __('Hora de salida'),
            'pot_id' => __('Olla'),
            'operator_id' => __('Operador'),
            'cement_amount' => __('Cemento'),
            'additive_amount' => __('Aditivo'),
            'fiber_amount' => __('Fibra (cant.)'),
            'waterproofing_amount' => __('Impermeabilizante (cant.)'),
            'gravel' => __('Grava'),
            'sand' => __('Arena'),
            'water' => __('Agua'),
            'tp' => __('TP'),
            'invoice' => __('Factura'),
        ];
    }
}
