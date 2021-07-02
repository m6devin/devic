<?php

namespace App\Http\Api\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Translation;
use App\Models\Review;
use App\Models\Step;

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
            (translations.last_review >=  DATE_ADD(?, INTERVAL -1 MINUTE) )
            )', [new \DateTime(), new \DateTime()]);
        }

        $words = $qry->orderBy('translations.step_id', 'DES')->orderBy('words.id', 'desc')->paginate(50);

        return response()->json($words);
    }

    public function setReview(Request $r, Translation $translation)
    {
        DB::beginTransaction();
        $user = Auth::user();
        if ($user->id != $translation->created_by_id) {
            return $this->quickResponse('translation not found!', 404);
        }
        a:
        $now = new \DateTime();
        $step = $translation->step;
        if (null == $translation->step_id && true == $translation->archived/* Archived word*/) {
            if (true == boolval($r->input('remembered'))) {
                return $this->quickResponse('This translation is archived!', 422);
            } else {
                $lastReview = $translation->reviews()->orderBy('id', 'desc')->first();
                if (! $lastReview) {
                    $translation->step_id = null;
                    $translation->save();
                    goto a;
                }

                // Check for updating review
                $lastReviewTimestamp = (new \DateTime($lastReview->created_at))->getTimestamp();
                $diff = $now->getTimestamp() - $lastReviewTimestamp;

                if ($diff < (1 * 60)) {
                    $review = $lastReview;
                    if (true == $lastReview->remembered) {
                        --$translation->success_reviews_count;
                    } else {
                        --$translation->fail_reviews_count;
                    }
                    $translation->archived = false;
                    $translation->save();
                    goto b;
                }
                $review = new Review();
                $review->step_id = $translation->step_id;
                goto b;
            }
        }

        if (null == $translation->step_id && false == $translation->archived /* word is on 'new word' mode and can be reviewed*/) {
            $review = new Review();
            $review->step_id = $translation->step_id;
        } else {
            $lastReview = $translation->reviews()->orderBy('id', 'desc')->first();
            if (! $lastReview) {
                $translation->step_id = null;
                $translation->save();
                goto a;
            }

            // Check for updating review
            $lastReviewTimestamp = (new \DateTime($lastReview->created_at))->getTimestamp();
            $diff = $now->getTimestamp() - $lastReviewTimestamp;

            if ($diff < (1 * 60)) {
                $review = $lastReview;
                $translation->step_id = $lastReview->step_id;

                if (true == $lastReview->remembered) {
                    --$translation->success_reviews_count;
                } else {
                    --$translation->fail_reviews_count;
                }
                $translation->save();
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
            $review->step_id = $translation->step_id;

            goto b;
        }
        b:

        $translation->last_review = $now;
        if (true == boolval($r->input('remembered'))) {
            ++$translation->success_reviews_count;
            ++$translation->step_id;
        } else {
            ++$translation->fail_reviews_count;
            $translation->step_id = 1; // 24 hour review
        }

        $maxStepID = Step::max('id');
        if ($maxStepID == ($translation->step_id - 1) /*translation is in its last step and must be archived*/) {
            $translation->step_id = null;
            $translation->archived = true;
        }
        $translation->total_reviews_count = $translation->success_reviews_count + $translation->fail_reviews_count;
        $translation->save();

        $review->item_id = $translation->id;
        $review->remembered = boolval($r->input('remembered'));
        $review->created_at = $now;
        if (($review->step_id - 1) == $maxStepID) {
            $review->step_id = null;
        }
        $review->review_type = 't';
        $review->save();

        DB::commit();

        return $this->wordDetails($r, $translation->id);
    }

    public function wordDetails(Request $r, $id)
    {
        $word = Translation::with([
            'reviews',
            'wordItem',
        ])
        ->where('id', $id)
        ->where('created_by_id', Auth::user()->id)
        ->first();

        return response($word);
    }
}
