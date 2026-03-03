<?php

namespace App\Services;

use App\Models\Cement;
use App\Models\Remission;

class CementService
{
    /**
     * Get the total amount of cement in KG.
     * Calculated as (Total Cement Entries - Total Cement Used in Remissions).
     *
     * @return float
     */
    public function getTotalKg(): float
    {
        $totalInput = (float) Cement::where('status', 'closed')->sum('tons'); // Only closed entries
        $totalUsedKilos = (float) Remission::sum('cement_amount');

        return $totalInput - $totalUsedKilos;
    }
}
