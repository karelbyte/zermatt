<?php

namespace App\Services;

use App\Models\Waterproofing;
use App\Models\Remission;

class WaterproofingService
{
    /**
     * Get the total amount of waterproofing.
     * Calculated as (Total Waterproofing Entries - Total Waterproofing Used in Remissions).
     *
     * @return float
     */
    public function getTotalAmount(): float
    {
        $totalInput = (float) Waterproofing::where('status', 'closed')->sum('lit');
        $totalUsed = (float) Remission::where('status', '!=', 'cancelada')->sum('waterproofing_amount');

        return $totalInput - $totalUsed;
    }
}
