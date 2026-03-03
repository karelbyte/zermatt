<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckModulePermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $module): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(403);
        }

        if ($user->name === 'Admin' || $user->is_admin) {
            return $next($request);
        }

        if ($user->permissions && in_array($module, $user->permissions)) {
            return $next($request);
        }

        abort(403, 'No tienes permiso para acceder a este módulo.');
    }
}
