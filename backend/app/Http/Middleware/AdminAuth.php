<?php

namespace App\Http\Middleware;

use Closure;
use Auth;

class AdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = Auth::guard()->user();

        if (! $user) {
            return response()->json([
                'message' => 'احراز هویت ناموفق بود.',
            ], 401);
        }

        if (!in_array('admin', json_decode($user->roles))) {
            return response()->json([
                'message' => 'منبع درخواستی در دسترس نیست.',
            ], 403);
        }

        return $next($request);
    }
}
