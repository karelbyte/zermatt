<?php

namespace App\Services;

use App\Models\Additive;

class AdditiveService
{
    /**
     * Get the total amount of additives in liters.
     * This sums all positive and negative amounts.
     *
     * @return float
     */
    public function getTotalLiters(): float
    {
        return (float) Additive::where('status', 'closed')->sum('lit');
    }
}
