<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Language;
use App\Models\Word;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class WordController extends Controller
{
    public function index(Request $r)
    {
        $this->authorizeAction(ACTION_MY_WORDS_CRUD);
        $user = Auth::user();

        $items = Word::with(['reviews', 'translations']);
        $items = $this->buildSearchQuery($r, $items, $this->searchableProperties());

        if ($this->filters['today_review'] && !empty($this->filters['today_review']['value'])) {
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

    public function getBasicInfo(Request $r)
    {
        $word = null;
        if ($r->get('word_id', null)) {
            $word = Word::with(['translations'])
            ->where('created_by_id', Auth()->user()->id)
            ->find($r->get('word_id', null));
        }
        return response()->json([
            'languages' => Language::get()->map(function ($item) {
                return ['label' => $item->name, 'value' => $item->alpha2code];
            }),
            'word' => $word,
        ]);
    }

    public function save(Request $r, $id = null)
    {
        $this->validateRequest($r);
        
        $wordToSave = strtolower($r->input('word', null));
        $this->validateWordUniqueness($wordToSave, $id);

        $from = $r->input('language_alpha2code', null);
        $this->validateFromLanguage($from);

        $word = $this->getWord($id);
        $word->word = $wordToSave;
        $word->language_alpha2code = $from;
        $word->created_by_id = Auth::user()->id;
        $word->save();

        $word->translations;

        return response()->json($word);
    }

    private function validateRequest(Request $r)
    {
        $this->validate($r, [
            'word' => 'required',
            'language_alpha2code' => 'required',
        ], []);
    }

    private function validateWordUniqueness(string $word, $id = null)
    {
        $qry = Word::where('word', $word)->where('created_by_id', Auth::user()->id);
        if ($id) {
            $qry = $qry->where('id', '<>', $id);
        }
        $dbWord = $qry->first();
        if (!$dbWord) {
            // this word has never been saved
            return;
        }

        throw ValidationException::withMessages([
            'word' => 'This word exists.'
        ]);
    }

    private function validateFromLanguage(string $fromLanguageAlpha2Code)
    {
        $fromLang = Language::where('alpha2code', $fromLanguageAlpha2Code)->first();

        if (! $fromLang) {
            throw ValidationException::withMessages([
                'language_alpha2code' => ['Invalid source language'],
            ]);
        }
    }

    private function getWord($id = null)
    {
        if ($id) {
            $word = Word::where('id', $id)
                        ->where('created_by_id', Auth::user()->id)
                        ->first();
            if (! $word) {
                throw ValidationException::withMessages(['word' => 'No word found :(']);
            }

            return $word;
        }
        
        $word = new Word();
        // set as new word
        $word->step_id = null;
        $word->archived = false;

        return $word;
    }

    public function deleteWord($id)
    {
        $word = $this->getWord($id);
        $word->delete();
        return $this->quickJsonResponse('Word was deleted!');
    }
}
