<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Remission extends Model
{
    /** @use HasFactory<\Database\Factories\RemissionFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'order_number',
        'remision',
        'client_id',
        'work_id',
        'usage_id',
        'fc',
        'concrete_type_id',
        'concept',
        'added',
        'slump',
        'pump',
        'impermeable',
        'fiber',
        'quantity',
        'pending_delivery',
        'specification',
        'product',
        'observations',
        'departure_date',
        'pot_id',
        'operator_id',
        'cement_amount',
        'additive_amount',
        'fiber_amount',
        'gravel',
        'sand',
        'water',
        'gravel',
        'sand',
        'water',
        'tp',
        'invoice',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'pump' => 'boolean',
            'impermeable' => 'boolean',
            'fiber' => 'boolean',
            'quantity' => 'decimal:2',
            'pending_delivery' => 'decimal:2',
            'additive_amount' => 'decimal:2',
            'fiber_amount' => 'decimal:2',
            'gravel' => 'decimal:2',
            'sand' => 'decimal:2',
            'water' => 'decimal:2',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function work(): BelongsTo
    {
        return $this->belongsTo(Work::class);
    }

    public function usage(): BelongsTo
    {
        return $this->belongsTo(Usage::class);
    }

    public function concreteType(): BelongsTo
    {
        return $this->belongsTo(ConcreteType::class);
    }

    public function pot(): BelongsTo
    {
        return $this->belongsTo(Pot::class);
    }

    public function operator(): BelongsTo
    {
        return $this->belongsTo(Operator::class);
    }
}
