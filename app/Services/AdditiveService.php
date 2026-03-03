<?php

namespace App\Services;

use App\Models\Additive;
use App\Models\Remission;

class AdditiveService
{
    /**
     * Get the total amount of additives in liters.
     * Calculated as (Total Additive Entries - Total Additive Used in Remissions).
     *
     * @return float
     */
    public function getTotalLiters(): float
    {
        $totalInput = (float) Additive::where('status', 'closed')->sum('lit');
        $totalUsedLiters = (float) Remission::sum('additive_amount');

        return $totalInput - $totalUsedLiters;
    }
}
