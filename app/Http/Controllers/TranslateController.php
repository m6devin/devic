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

        return view('translate.translate', [
            'dbWord' => $dbWord,
            'word' => $word,
            'langs' => $langs,
            'partsOfSpeech' => $partsOfSpeech,
            'fromLang' => $fromLang,
            'toLang' => $toLang,
        ]);
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
            'language' => 'required',
        ], []);

        $id = $r->input('id', null);
        $word = $r->input('word', null);
        $from = $r->input('language', null);
        $fromLang = Language::where('alpha2code', $from)->first();

        if ($id) {
            $dbWord = Word::where('id', $id)
                    ->where('created_by_id', Auth::user()->id)
                    ->where('language_id', $fromLang->id)
                    ->first();
            if (! $dbWord) {
                return response('No word found :(', 404);
            }
        } else {
            $dbWord = Word::where('word', $word)
                    ->where('created_by_id', Auth::user()->id)
                    ->where('language_id', $fromLang->id)
                    ->first();
            if ($dbWord) {
                return response(['message' => 'The given data was invalid.', 'errors' => [
                    'word' => ['This word already tranlated!'],
                ]], 422);
            }

            $dbWord = new Word();
        }

        $dbWord->word = $word;
        $dbWord->language_id = $fromLang->id;
        $dbWord->created_by_id = Auth::user()->id;
        $dbWord->save();

        return response($dbWord);
    }

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
}
