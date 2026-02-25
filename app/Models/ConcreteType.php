<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ConcreteType extends Model
{
    /** @use HasFactory<\Database\Factories\ConcreteTypeFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'type',
        'concept',
        'description',
        'active',
        'base_price',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'active' => 'boolean',
            'base_price' => 'decimal:2',
        ];
    }

    /**
     * @return HasMany<Design, $this>
     */
    public function designs(): HasMany
    {
        return $this->hasMany(Design::class);
    }
}
