<?php

namespace App\Concerns;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    protected static function bootLogsActivity(): void
    {
        static::created(function ($model) {
            $model->logActivity('created');
        });

        static::updated(function ($model) {
            $model->logActivity('updated');
        });

        static::deleted(function ($model) {
            $model->logActivity('deleted');
        });
    }

    protected function logActivity(string $action): void
    {
        if (!Auth::check()) {
            return;
        }

        $oldValues = null;
        $newValues = null;

        if ($action === 'updated') {
            $oldValues = $this->getOriginal();
            $newValues = $this->getAttributes();
            
            // Remove timestamps and unchanged values
            unset($oldValues['created_at'], $oldValues['updated_at']);
            unset($newValues['created_at'], $newValues['updated_at']);
            
            // Only log changed values
            $changes = array_diff_assoc($newValues, $oldValues);
            if (empty($changes)) {
                return;
            }
            
            $oldValues = array_intersect_key($oldValues, $changes);
            $newValues = $changes;
        } elseif ($action === 'created') {
            $newValues = $this->getAttributes();
            unset($newValues['created_at'], $newValues['updated_at']);
        } elseif ($action === 'deleted') {
            $oldValues = $this->getOriginal();
            unset($oldValues['created_at'], $oldValues['updated_at']);
        }

        ActivityLog::create([
            'user_id' => Auth::id(),
            'model_type' => get_class($this),
            'model_id' => $this->id,
            'action' => $action,
            'description' => $this->getActivityDescription($action),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    protected function getActivityDescription(string $action): string
    {
        $modelName = class_basename($this);
        $identifier = $this->name ?? $this->id;

        $actionMap = [
            'created' => "Creó {$modelName}: {$identifier}",
            'updated' => "Actualizó {$modelName}: {$identifier}",
            'deleted' => "Eliminó {$modelName}: {$identifier}",
        ];

        return $actionMap[$action] ?? "{$action} {$modelName}";
    }
}
