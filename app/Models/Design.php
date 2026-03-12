<?php

namespace App\Models;

use App\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Design extends Model
{
    /** @use HasFactory<\Database\Factories\DesignFactory> */
    use HasFactory, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'concrete_type_id',
        'added',
        'slump',
        'fc',
        'cement',
        'sand',
        'gravel',
        'water',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'cement' => 'float',
            'sand' => 'float',
            'gravel' => 'float',
            'water' => 'float',
        ];
    }

    /**
     * @return BelongsTo<ConcreteType, $this>
     */
    public function concreteType(): BelongsTo
    {
        return $this->belongsTo(ConcreteType::class);
    }
}
