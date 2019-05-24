<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Language;
use App\Word;
use Auth;

class WordController extends Controller
{
    public function index(Request $r)
    {
        $this->authorizeAction(ACTION_MY_WORDS_CRUD);
        $user = Auth::user();

        $items = Word::with(['reviews']);
        $items = $this->buildSearchQuery($r, $items, $this->searchableProperties());

        if ($this->filters['today_review']) {
            $items = $items->whereRaw('(
            (words.step_id IS NULL and words.archived = 0) OR 
            (SELECT DATE_ADD(words.last_review, INTERVAL (SELECT days from steps where words.step_id = steps.id) DAY) ) <= (SELECT DATE_ADD(?, INTERVAL 8 HOUR) ) OR
            (words.last_review >=  DATE_ADD(?, INTERVAL -1 MINUTE) )
            )', [new \DateTime(), new \DateTime()]);
        }
        $items = $items
        ->where('created_by_id', $user->id)
        ->orderBy('step_id', 'DES')
        ->orderBy('id', 'desc')
        ->paginate(50);

        return response()->json($items);
    }

    /**
     * @return array
     */
    private function searchableProperties()
    {
        return [
            'word',
            'language_alpha2code',
            'step_id',
            'archived',
        ];
    }

    public function getBasicInfo() 
    {
        return response()->json([
            'languages' => Language::get()->map(function ($item) {
                return ['label' => $item->name, 'value' => $item->alpha2code];
            }),
        ]);
    }
}
