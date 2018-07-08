<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use JWTAuth;

class JWT {
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next) {
        $user = JWTAuth::parseToken()->authenticate();
        
        if(!$user) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        return $next($request);
    }
}
