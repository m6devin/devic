<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\Word;
use App\Translation;

class ReverseReviewController extends Controller
{
    public function wordsList(Request $r)
    {
        $user = Auth::user();

        $filters = json_decode($r->input('filters', []), true);
        $todayReview = isset($filters['today_review']) ? $filters['today_review'] : null;

        $qry = Translation::with([
            'reviews',
            'wordItem',
        ])
        ->join('words', 'translations.word_id', '=', 'words.id')
        ->where('words.created_by_id', $user->id)
        ->select('translations.*', 'words.word');

        if (true == $todayReview) {
            $qry = $qry->whereRaw('(
            (translations.step_id IS NULL and words.archived = 0) OR 
            (SELECT DATE_ADD(translations.last_review, INTERVAL (SELECT days from steps where translations.step_id = translations.id) DAY) ) <= (SELECT DATE_ADD(?, INTERVAL 8 HOUR) ) OR
            (translations.last_review >=  DATE_ADD(?, INTERVAL -5 MINUTE) )
            )', [new \DateTime(), new \DateTime()]);
        }

        $words = $qry->orderBy('translations.step_id', 'DES')->orderBy('words.id', 'desc')->paginate(50);

        return response()->json($words);
    }
}
