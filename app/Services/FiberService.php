<?php

namespace App\Services;

use App\Models\Fiber;
use App\Models\Remission;

class FiberService
{
    /**
     * Get the total amount of fiber.
     * Calculated as (Total Fiber Entries - Total Fiber Used in Remissions).
     *
     * @return float
     */
    public function getTotalAmount(): float
    {
        $totalInput = (float) Fiber::where('status', 'closed')->sum('lit');
        $totalUsed = (float) Remission::sum('fiber_amount');

        return $totalInput - $totalUsed;
    }
}
