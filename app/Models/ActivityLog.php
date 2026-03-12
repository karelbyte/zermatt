<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'model_type',
        'model_id',
        'action',
        'description',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'old_values' => 'array',
            'new_values' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getModelNameAttribute(): string
    {
        $modelMap = [
            'App\Models\User' => 'Usuario',
            'App\Models\Client' => 'Cliente',
            'App\Models\Work' => 'Obra',
            'App\Models\Pot' => 'Olla',
            'App\Models\Operator' => 'Operador',
            'App\Models\Supplier' => 'Proveedor',
            'App\Models\Cement' => 'Cemento',
            'App\Models\Additive' => 'Aditivo',
            'App\Models\ConcreteType' => 'Tipo de Concreto',
            'App\Models\Design' => 'Diseño',
            'App\Models\Usage' => 'Uso',
            'App\Models\Remission' => 'Remisión',
        ];

        return $modelMap[$this->model_type] ?? class_basename($this->model_type);
    }

    public function getActionNameAttribute(): string
    {
        $actionMap = [
            'created' => 'Creó',
            'updated' => 'Actualizó',
            'deleted' => 'Eliminó',
        ];

        return $actionMap[$this->action] ?? $this->action;
    }
}
