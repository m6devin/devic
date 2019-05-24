<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function authorizeAction(string $action)
    {
        if (!Auth()->user()->isPermitted($action)) {
            abort(403, 'عملیات مورد نظر برای شما در دسترس نیست.');
        }
        return true;
    }

    public function quickJsonResponse($message, $statusCode = 200, $errorsArray = [])
    {
        $res = [
            'message' => $message,
        ];
        if (count($errorsArray) > 0) {
            $res['errors'] = $errorsArray;
        }
        return response()->json($res, $statusCode);
    }

    /**
     * فیلتر های ارسالی در کوئری استرینگ را استخراج میکند.
     *
     * @param \Illuminate\Http\Request $r
     *
     * @return array
     */
    public function getFilters(Request $r)
    {
        $filters = $r->get('filters', null);
        if (null == $filters) {
            return [];
        }

        $arr = json_decode($filters, true);
        if (! $arr) {
            return [];
        }

        return $arr;
    }

    /**
     * کوئری سرچ شونده را بر اساس فیلتر های رکوئست ایجاد میکند.
     *
     * @param \Illuminate\Http\Request              $r
     * @param \Illuminate\Database\Eloquent\Builder $queryBuilder
     * @param array                                 $searchableProperties
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function buildSearchQuery(Request $r, \Illuminate\Database\Eloquent\Builder $queryBuilder, $searchableProperties = [])
    {
        $filters = $this->getFilters($r);
        foreach ($filters as $key => $f) {
            $value = trim($f['value']);
            $f['name'] = $key;
            if (! isset($f['name']) || ! isset($value) || '' === $value) {
                continue;
            }

            if (! isset($f['operator'])) {
                $f['operator'] = '=';
            }

            $col = $f['name'];
            $op = $f['operator'];
            if (! in_array($col, $searchableProperties)) {
                continue;
            }

            if ('LIKE' === $op) {
                $value = "%{$value}%";
            }

            if (preg_match('/^descriptions\..*$/', $col)) {
                $col = preg_replace('/^(descriptions\.)(.*)$/', '$2', $col);
                $queryBuilder = $queryBuilder->whereHas('descriptions', function ($qry) use ($col, $op, $value) {
                    $qry->where($col, $op, $value);
                });
            } else {
                $queryBuilder = $queryBuilder->where($col, $op, $value);
            }
        }

        return $queryBuilder;
    }
}
