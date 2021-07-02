<?php

namespace App\Http\Api\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\PartOfSpeech;
use App\Models\Review;
use App\Models\Step;
use App\Models\Translation;
use App\Models\Word;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\WordRepository;
use Illuminate\Validation\ValidationException;

class TranslateController extends Controller
{
    public function getBasicInfo()
    {
        return response()->json([
            'languages' => Language::get()->map(function ($item) {
                return ['label' => $item->name, 'value' => $item->alpha2code];
            }),
            'parts_of_speech' => PartOfSpeech::get()->map(function ($item) {
                return ['label' => $item->name, 'value' => $item->name];
            }),
        ]);
    }

    public function searchForTranslation(Request $r)
    {
        $this->validateTranslateRequest($r);
        $searchedWord = strtolower($r->input('word', null));
        $fromLanguage = $r->input('from_language', null);
        $toLanguage = $r->input('to_language', null);

        $word = (new WordRepository)->findWord($searchedWord, $fromLanguage, Auth()->user()->id);
        if (! $word) {
            return $this->quickJsonResponse('no match found', 404);
        }
        $word->getTranslations($toLanguage);

        return response()->json($word);
    }

    private function validateTranslateRequest(Request $r)
    {
        $this->validate($r, [
            'word' => 'required',
            'from_language' => 'required',
            'to_language' => 'required',
        ]);
    }

    public function save(Request $r, $id = null) 
    {        
        $this->validateSaveTranslationRequest($r);
        $this->validateTranslationLanguage($r->input('language_alpha2code'));
        $this->validateSelectedWordToTranslate($r->input('word_id'));
        $reqModel = $this->loadRequestModel($r);

        DB::beginTransaction();
        if ($id) {
            $trans = Translation::where('created_by_id', Auth()->user()->id)->find($id);
            if (! $trans) {
                return $this->quickJsonResponse('Translation not found!', 404);
            }
        } else {
            $trans = new Translation();
        }
        $trans->fill($reqModel);
        $trans->created_by_id = Auth::user()->id;
        $trans->save();
        $trans->partOfSpeech;

        DB::commit();

        return response($trans, 200);
    }

    private function validateSaveTranslationRequest(Request $r)
    {
        $this->validate($r, [
            'language_alpha2code' => 'required', 
            'translation' => 'required',
            'word_id' => 'required',
        ]);
    }

    private function validateTranslationLanguage(string $languageAlpha2Code)
    {
        $language = Language::where('alpha2code', $languageAlpha2Code)->first();

        if (! $language) {
            throw ValidationException::withMessages([
                'language_alph2code' => ['Invalid language'],
            ]);
        }
    }

    private function validateSelectedWordToTranslate($wordID) 
    {
        $word = Word::where('id', $wordID)->where('created_by_id', Auth()->user()->id)->first();

        if (! $word) {
            throw ValidationException::withMessages([
                'word_id' => ['No related word found!'],
            ]);
        }
    }

    private function loadRequestModel(Request $r) :array 
    {
        return $r->only([
            'word_id',
            'language_alpha2code',
            'part_of_speech_name',
            'translation',
            'definition',
            'example',
        ]);
    }

    public function deleteTranslation(Request $r, $id)
    {
        $trans = Translation::where('created_by_id', Auth()->user()->id)
        ->findOrFail($id);
        
        $trans->delete();
        return $this->quickJsonResponse('Translatoin was deleted.');
    }



    /**
     * All functions below this comment need review
     */


    /**
     * Show all translations of word in API.
     *
     * @param Request $r
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function translateAPI(Request $r)
    {
        $this->validate($r, [
            'word' => 'required',
            'from_language' => 'required',
            'to_language' => 'required',
        ]);

        $word = strtolower($r->input('word', null));
        $from = $r->input('from_language', null);
        $to = $r->input('to_language', null);
        $dbWord = null;
        $translations = [];

        $dbWord = Word::with(['language'])
        ->where('word', $word)
        ->where('language_alpha2code', $from)
        ->where('created_by_id', Auth::user()->id)
        ->first();

        if (! $dbWord) {
            return response()->json([
                'message' => 'no match found.',
            ], 404);
        }
        $translations = Translation::with([
            'partOfSpeech',
            'language',
        ])
        ->where('word_id', $dbWord->id)
        ->where('language_alpha2code', $to)
        ->where('created_by_id', Auth::user()->id)
        ->get();

        $dbWord->translations = $translations;

        return response()->json($dbWord);
    }

    /**
     * Insert or update word.
     *
     * @param Request $r
     *
     * @return Response
     */
    public function saveWord(Request $r)
    {
        $this->validate($r, [
            'word' => 'required',
            'language_alph2code' => 'required',
        ], []);

        $id = $r->input('id', null);
        $word = strtolower($r->input('word', null));
        $from = $r->input('language_alph2code', null);
        $fromLang = Language::where('alpha2code', $from)->first();

        if (! $fromLang) {
            return response(['message' => 'The given data was invalid.', 'errors' => [
                'language_alph2code' => ['Invalid source language'],
            ]], 404);
        }

        if ($id) {
            $dbWord = Word::where('id', $id)
                    ->where('created_by_id', Auth::user()->id)
                    ->first();
            if (! $dbWord) {
                return response(['message' => 'No word found :('], 404);
            }

            //check uniqueness
            $cnt = Word::where('word', $word)
                    ->where('created_by_id', Auth::user()->id)
                    ->where('language_alpha2code', $fromLang->id)
                    ->where('id', '<>', $id)
                    ->count();
            if ($cnt >= 1) {
                return response(['message' => 'The given data was invalid.', 'errors' => [
                    'word' => ['This word already exists in your phrasebook!'],
                ]], 422);
            }
        } else {
            //check uniqueness
            $cnt = Word::where('word', $word)
                    ->where('created_by_id', Auth::user()->id)
                    ->where('language_alpha2code', $fromLang->alpha2code)
                    ->count();
            if ($cnt >= 1) {
                return response(['message' => 'The given data was invalid.', 'errors' => [
                    'word' => ['This word already exists in your phrasebook!'],
                ]], 422);
            }

            $dbWord = new Word();

            // set as new word
            $dbWord->step_id = null;
            $dbWord->archived = false;
        }

        $dbWord->word = $word;
        $dbWord->language_alpha2code = $fromLang->alpha2code;
        $dbWord->created_by_id = Auth::user()->id;
        $dbWord->save();

        $dbWord = Word::with(['language'])
        ->where('id', $dbWord->id)
        ->first();

        $translations = Translation::with([
            'partOfSpeech',
            'language',
        ])
        ->where('word_id', $dbWord->id)
        ->where('language_alpha2code', $r->input('language_alpha2code'))
        ->where('created_by_id', Auth::user()->id)
        ->get();

        $dbWord->translations = $translations;

        return response()->json($dbWord);
    }

    /**
     * Add or update translation of a word.
     *
     * @param \Illuminate\Http\Request $r
     *
     * @return \Illuminate\Http\Response
     */
    public function saveTranslation(Request $r)
    {
        $this->validate($r, [
            'word_id' => 'required',
            'from_language_alpha2code' => 'required',
            'to_language_alpha2code' => 'required',
            'translation' => 'required',
        ], []);

        $wordID = $r->input('word_id');
        $from = $r->input('from_language_alpha2code', null);
        $to = $r->input('to_language_alpha2code', null);
        $dbWord = null;
        $fromLang = Language::where('alpha2code', $from)->first();
        $toLang = Language::where('alpha2code', $to)->first();

        $errs = [];
        if (! $fromLang) {
            $errs['language_alpha2code'] = ['Source language not selected.'];
        }
        if (! $toLang) {
            $errs['language_alpha2code'] = ['Destination language not selected.'];
        }
        if (count($errs)) {
            return response([
                'message' => 'The given data was invalid.',
                'errors' => $errs,
            ], 422);
        }
        $dbWord = Word::where('id', $wordID)
        ->where('created_by_id', Auth::user()->id)
        ->where('language_alpha2code', $fromLang->alpha2code)
        ->first();
        if (! $dbWord) {
            return response('No word found :(', 404);
        }

        DB::beginTransaction();

        $id = $r->input('id', null);
        if ($id) {
            $trans = Translation::find($id);
            if (! $trans) {
                $trans = new Translation();
            }
        } else {
            $trans = new Translation();
        }

        $trans->translation = $r->input('translation');
        $trans->language_alpha2code = $toLang->alpha2code;
        $trans->part_of_speech_name = $r->input('part_of_speech_name');
        $trans->definition = $r->input('definition');
        $trans->example = $r->input('example');
        $trans->created_by_id = Auth::user()->id;

        $dbWord->translations()->save($trans);
        $trans->language;
        $trans->partOfSpeech;

        DB::commit();

        return response($trans, 200);
    }


    /**
     * Load phrasebook words for API calls.
     *
     * @param \Illuminate\Http\Request $r
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function phrasebookAPI(Request $r)
    {
        $user = Auth::user();

        $filters = json_decode($r->input('filters', []), true);
        $word = isset($filters['word']) ? $filters['word'] : null;
        $from = isset($filters['from']) ? $filters['from'] : null;
        $todayReview = isset($filters['today_review']) ? $filters['today_review'] : null;

        $qry = Word::with([
            'language',
            'translations',
            'translations.language',
            'translations.partOfSpeech',
            'reviews',
            'step',
        ])->where('created_by_id', $user->id);

        if ($from) {
            $qry = $qry->where('language_alpha2code', $from);
        }
        if ($word) {
            $qry = $qry->where('word', 'LIKE', "%{$word}%");
        }
        if (true == $todayReview) {
            $qry = $qry->whereRaw('(
            (words.step_id IS NULL and words.archived = 0) OR 
            (SELECT DATE_ADD(words.last_review, INTERVAL (SELECT days from steps where words.step_id = steps.id) DAY) ) <= (SELECT DATE_ADD(?, INTERVAL 8 HOUR) ) OR
            (words.last_review >=  DATE_ADD(?, INTERVAL -1 MINUTE) )
            )', [new \DateTime(), new \DateTime()]);
        }

        $words = $qry->orderBy('step_id', 'DES')->orderBy('id', 'desc')->paginate(50);

        return response()->json($words);
    }

    /**
     * Show all details of word.
     *
     * @param \Illuminate\Http\Request $r
     * @param int                      $id
     *
     * @return \Illuminate\Http\Response
     */
    public function wordDetails(Request $r, $id)
    {
        $word = Word::with([
            'language',
            'translations',
            'translations.language',
            'translations.partOfSpeech',
            'reviews',
            'step',
        ])
        ->where('id', $id)
        ->where('created_by_id', Auth::user()->id)
        ->first();

        return response($word);
    }

    

    /**
     * Save review status in review logs.
     *
     * @param \Illuminate\Http\Request $r
     * @param \App\Word                $word
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function setWordReview(Request $r, Word $word)
    {
        DB::beginTransaction();
        $user = Auth::user();
        if ($user->id != $word->created_by_id) {
            return $this->quickResponse('Word not found!', 404);
        }
        a:
        $now = new \DateTime();
        $step = $word->step;
        if (null == $word->step_id && true == $word->archived/* Archived word*/) {
            if (true == boolval($r->input('remembered'))) {
                return $this->quickResponse('This word is archived!', 422);
            } else {
                $lastReview = $word->reviews()->orderBy('id', 'desc')->first();
                if (! $lastReview) {
                    $word->step_id = null;
                    $word->save();
                    goto a;
                }

                // Check for updating review
                $lastReviewTimestamp = (new \DateTime($lastReview->created_at))->getTimestamp();
                $diff = $now->getTimestamp() - $lastReviewTimestamp;

                if ($diff < (1 * 60)) {
                    $review = $lastReview;
                    if (true == $lastReview->remembered) {
                        --$word->success_reviews_count;
                    } else {
                        --$word->fail_reviews_count;
                    }
                    $word->archived = false;
                    $word->save();
                    goto b;
                }
                $review = new Review();
                $review->step_id = $word->step_id;
                goto b;
            }
        }

        if (null == $word->step_id && false == $word->archived /* word is on 'new word' mode and can be reviewed*/) {
            $review = new Review();
            $review->step_id = $word->step_id;
        } else {
            $lastReview = $word->reviews()->orderBy('id', 'desc')->first();
            if (! $lastReview) {
                $word->step_id = null;
                $word->save();
                goto a;
            }

            // Check for updating review
            $lastReviewTimestamp = (new \DateTime($lastReview->created_at))->getTimestamp();
            $diff = $now->getTimestamp() - $lastReviewTimestamp;

            if ($diff < (1 * 60)) {
                $review = $lastReview;
                $word->step_id = $lastReview->step_id;

                if (true == $lastReview->remembered) {
                    --$word->success_reviews_count;
                } else {
                    --$word->fail_reviews_count;
                }
                $word->save();
                goto b;
            }

            // exact datetime of next review
            $nextReview = $lastReviewTimestamp + ($step->days * (24 * 60 * 60));

            // next review can be done 8 hours before the exact time
            $minReviewAvailable = $nextReview - (8 * 60 * 60);
            if ($minReviewAvailable >= $now->getTimestamp()) {
                $msg = sprintf(
                    'Your last review was at %s and next reviwe will be available at %s.',
                $lastReview->created_at->format('Y-m-d H:i:s'),
                date('Y-m-d H:i:s', $minReviewAvailable)
                );

                return $this->quickResponse($msg, 422);
            }

            $review = new Review();
            $review->step_id = $word->step_id;

            goto b;
        }
        b:

        $word->last_review = $now;
        if (true == boolval($r->input('remembered'))) {
            ++$word->success_reviews_count;
            ++$word->step_id;
        } else {
            ++$word->fail_reviews_count;
            $word->step_id = 1; // 24 hour review
        }

        $maxStepID = Step::max('id');
        if ($maxStepID == ($word->step_id - 1) /*word is in its last step and must be archived*/) {
            $word->step_id = null;
            $word->archived = true;
        }
        $word->total_reviews_count = $word->success_reviews_count + $word->fail_reviews_count;
        $word->save();

        $review->item_id = $word->id;
        $review->remembered = boolval($r->input('remembered'));
        $review->created_at = $now;
        if (($review->step_id - 1) == $maxStepID) {
            $review->step_id = null;
        }
        $review->review_type = 'w';
        $review->save();

        DB::commit();
        return $this->wordDetails($r, $word->id);
    }
}
