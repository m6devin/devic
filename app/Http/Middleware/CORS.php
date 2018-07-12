<?php

namespace App\Http\Middleware;

use Closure;

class CORS
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $headers = [
            "Access-Control-Allow-Origin" => "*",
            "Access-Control-Allow-Headers" => "Content-Type,Accept",
        ];

        if ($request->getMethod() == 'OPTIONS') {
            return response('', 200, $headers);
        }

        $res = $next($request);
        foreach ($headers as $k => $v) {
            $res->headers->set($k, $v);
        }
        return $res;
    }
}
