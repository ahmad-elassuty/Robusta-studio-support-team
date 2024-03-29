<?php

namespace App\Http\Middleware;

use Closure;
use Auth;

class UserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next, ...$roles)
    {
        if (!Auth::user()->hasRole($roles)) {
            return redirect()->back();
        }

        return $next($request);
    }
}
