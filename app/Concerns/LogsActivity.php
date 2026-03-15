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
            // Use Eloquent's tracked changes to avoid array-to-string conversions
            // when attributes are casted (e.g. JSON arrays like `permissions`).
            $changes = $this->getChanges();
            unset($changes['created_at'], $changes['updated_at']);

            if (empty($changes)) {
                return;
            }

            $oldValues = [];
            $newValues = [];
            foreach ($changes as $key => $newValue) {
                $oldValues[$key] = $this->getOriginal($key);
                $newValues[$key] = $newValue;
            }
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
