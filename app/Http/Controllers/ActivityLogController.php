<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $action = $request->query('action');
        $modelType = $request->query('model_type');
        $userId = $request->query('user_id');

        $logs = ActivityLog::query()
            ->with('user:id,name,email')
            ->when($search, function ($query, $search) {
                $query->where('description', 'ilike', "%{$search}%");
            })
            ->when($action, function ($query, $action) {
                $query->where('action', $action);
            })
            ->when($modelType, function ($query, $modelType) {
                $query->where('model_type', $modelType);
            })
            ->when($userId, function ($query, $userId) {
                $query->where('user_id', $userId);
            })
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        // Get unique model types for filter
        $modelTypes = ActivityLog::query()
            ->select('model_type')
            ->distinct()
            ->pluck('model_type')
            ->map(function ($type) {
                $modelMap = [
                    'App\Models\User' => 'Usuario',
                    'App\Models\Client' => 'Cliente',
                    'App\Models\Work' => 'Obra',
                    'App\Models\Pot' => 'Olla',
                    'App\Models\Operator' => 'Operador',
                    'App\Models\Supplier' => 'Proveedor',
                    'App\Models\Cement' => 'Cemento',
                    'App\Models\Additive' => 'Aditivo',
                    'App\Models\ConcreteType' => 'Tipo de Concreto',
                    'App\Models\Design' => 'Diseño',
                    'App\Models\Usage' => 'Uso',
                    'App\Models\Remission' => 'Remisión',
                ];
                return [
                    'value' => $type,
                    'label' => $modelMap[$type] ?? class_basename($type),
                ];
            })
            ->values();

        return Inertia::render('logs/index', [
            'logs' => $logs,
            'modelTypes' => $modelTypes,
            'filters' => [
                'search' => $search,
                'action' => $action,
                'model_type' => $modelType,
                'user_id' => $userId,
            ],
        ]);
    }
}
