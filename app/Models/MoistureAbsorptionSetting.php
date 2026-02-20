<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MoistureAbsorptionSetting extends Model
{
    /** @use HasFactory<\Database\Factories\MoistureAbsorptionSettingFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'humidity_gravel',
        'humidity_sand',
        'absorption_gravel',
        'absorption_sand',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'humidity_gravel' => 'float',
            'humidity_sand' => 'float',
            'absorption_gravel' => 'float',
            'absorption_sand' => 'float',
        ];
    }
}
