<?php

namespace App\Http\Controllers;

use App\Language;
use App\PartOfSpeech;
use App\Translation;
use App\Word;
use Auth;
use DB;
use Illuminate\Http\Request;

class TranslateController extends Controller {
    /**
     * Show all translations of word.
     *
     * @param Request $r
     *
     * @return Response
     */
    public function translate(Request $r) {
        $word = $r->input('q', null);
        $from = $r->input('from', null);
        $to = $r->input('to', null);
        $dbWord = null;
        $translations = [];

        $fromLang = Language::where('alpha2code', $from)->first();
        $toLang = Language::where('alpha2code', $to)->first();

        if ($word && $fromLang && $toLang) {
            $dbWord = Word::where('word', $word)
            ->where('language_id', $fromLang->id)
            ->where('created_by_id', Auth::user()->id)
            ->first();
        }
        $langs = Language::get();
        $partsOfSpeech = PartOfSpeech::get();

        if ($dbWord && $toLang) {
            $translations = Translation::where('word_id', $dbWord->id)
            ->where('language_id', $toLang->id)
            ->where('created_by_id', Auth::user()->id)
            ->get();
        }

        return view('translate.translate', [
            'dbWord' => $dbWord,
            'word' => $word,
            'langs' => $langs,
            'partsOfSpeech' => $partsOfSpeech,
            'fromLang' => $fromLang,
            'toLang' => $toLang,
            'translations' => $translations,
        ]);
    }

    /**
     * Show all translations of word in API.
     *
     * @param Request $r
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function translateAPI(Request $r) {
        $this->validate($r, [
            'word' => 'required',
            'from_language' => 'required',
            'to_language' => 'required',
        ]);

        $word = $r->input('word', null);
        $from = $r->input('from_language', null);
        $to = $r->input('to_language', null);
        $dbWord = null;
        $translations = [];

        $dbWord = Word::with(['language'])
        ->where('word', $word)
        ->where('language_id', $from)
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
        ->where('language_id', $to)
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
    public function saveWord(Request $r) {
        $this->validate($r, [
            'word' => 'required',
            'language_alph2code' => 'required',
        ], []);

        $id = $r->input('id', null);
        $word = $r->input('word', null);
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
                    ->where('language_id', $fromLang->id)
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
                    ->where('language_id', $fromLang->id)
                    ->count();
            if ($cnt >= 1) {
                return response(['message' => 'The given data was invalid.', 'errors' => [
                    'word' => ['This word already exists in your phrasebook!'],
                ]], 422);
            }

            $dbWord = new Word();
        }

        $dbWord->word = $word;
        $dbWord->language_id = $fromLang->id;
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
        ->where('language_id', $r->input('to_language_id'))
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
    public function saveTranslation(Request $r) {
        $this->validate($r, [
            'word_id' => 'required',
            'from_language_id' => 'required',
            'to_language_id' => 'required',
            'translation' => 'required',
        ], []);

        $wordID = $r->input('word_id');
        $from = $r->input('from_language_id', null);
        $to = $r->input('to_language_id', null);
        $dbWord = null;
        $fromLang = Language::where('id', $from)->first();
        $toLang = Language::where('id', $to)->first();

        $errs = [];
        if (! $fromLang) {
            $errs['from_language_id'] = ['Source language not selected.'];
        }
        if (! $toLang) {
            $errs['to_language_id'] = ['Destination language not selected.'];
        }
        if (count($errs)) {
            return response([
                'message' => 'The given data was invalid.',
                'errors' => $errs,
            ], 422);
        }
        $dbWord = Word::where('id', $wordID)
        ->where('created_by_id', Auth::user()->id)
        ->where('language_id', $fromLang->id)
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
        $trans->language_id = $toLang->id;
        $trans->part_of_speech_id = $r->input('part_of_speech_id');
        $trans->definition = $r->input('definition');
        $trans->example = $r->input('example');
        $trans->created_by_id = Auth::user()->id;

        $dbWord->translations()->save($trans);

        DB::commit();

        return response('OK', 200);
    }

    /**
     * List all user's words and search them.
     *
     * @param \Illuminate\Http\Request $r
     *
     * @return \Illuminate\Http\Response
     */
    public function phrasebook(Request $r) {
        $user = Auth::user();
        $langs = Language::get();
        $fromLang = null;
        $from = $r->input('from', null);
        $word = $r->input('word', null);

        if ($from) {
            $fromLang = Language::where('alpha2code', $from)->first();
        }

        $qry = Word::where('created_by_id', $user->id);
        if ($fromLang) {
            $qry = $qry->where('language_id', $fromLang->id);
        }
        if ($word) {
            $qry = $qry->where('word', 'LIKE', "%{$word}%");
        }
        $words = $qry->paginate(15);

        return view('translate.phrasebook', [
            'words' => $words,
            'langs' => $langs,
        ]);
    }

    /**
     * Show all details of word.
     *
     * @param \Illuminate\Http\Request $r
     * @param int                      $id
     *
     * @return \Illuminate\Http\Response
     */
    public function wordDetails(Request $r, $id) {
        $word = Word::with([
            'language',
            'translations',
            'translations.language',
            'translations.partOfSpeech',
        ])
        ->where('id', $id)
        ->where('created_by_id', Auth::user()->id)
        ->first();

        return response($word);
    }

    /**
     * Load basic informations required to render translaiton main form.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function basicInfo() {
        return response()->json([
            'langs' => Language::get(),
            'partsOfSpeech' => PartOfSpeech::get(),
        ]);
    }
}
