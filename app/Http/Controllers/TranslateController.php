<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Language;
use App\PartOfSpeech;
use App\Word;
use App\Translation;
use Auth;
use DB;

class TranslateController extends Controller
{

    /**
     * Show all translations of word
     *
     * @param Request $r
     * @return Response
     */
    public function translate(Request $r) {
        $word = $r->input("q", null);
        $from = $r->input('from', null);
        $to = $r->input('to', null);
        $dbWord = null;

        $fromLang = Language::where("alpha2code", $from)->first();
        $toLang = Language::where("alpha2code", $to)->first();

        if ($word && $fromLang && $toLang) {
            $dbWord = Word::where("word", $word)
            ->where("language_id", $fromLang->id)
            ->whereHas("translations", function($qry) use($toLang) {
                $qry->where("language_id", "=", $toLang->id);
            })
            ->first();
        }
        $langs = Language::get();
        $partsOfSpeech = PartOfSpeech::get();

        return view("translate.translate", [
            "dbWord" => $dbWord,
            "word" => $word,
            "langs" => $langs,
            "partsOfSpeech" => $partsOfSpeech,
        ]);
    }

    public function save(Request $r) {
        $this->validate($r, [
            'word' => "required",
            "from_language_id" => "required",
            "to_language_id" => "required",
            "translation" => "required"
        ], []);

        $word = $r->input('word');
        $from = $r->input('from_language_id', null);
        $to = $r->input('to_language_id', null);
        $dbWord = null;
        $fromLang = Language::where("alpha2code", $from)->first();
        $toLang = Language::where("alpha2code", $to)->first();

        $errs = [];
        if(!$fromLang) {
            $errs["from_language_id"] = ["Source language not selected."];
        }
        if(!$toLang) {
            $errs["to_language_id"] = ["Destination language not selected."];
        }
        if(count($errs)) {
            return response([
                "message" => "The given data was invalid.",
                "errors" => $errs,
            ], 422);
        }
        $dbWord = Word::where("word", $word)
            ->where("language_id", $fromLang->id)
            ->first();

        DB::beginTransaction();

        if (!$dbWord) {
            $dbWord = new Word();  
            $dbWord->word = $word;
            $dbWord->language_id = $fromLang->id;
            $dbWord->created_by_id = Auth::user()->id;
            $dbWord->save();
        }
        $id = $r->input("id", null);
        if ($id) {
            $trans = Translation::find($id);
            if (!$trans) {
                $trans = new Translation();
            }
        }else{
            $trans = new Translation();  
        }

        $trans->translation = $r->input("translation");
        $trans->language_id = $toLang->id;
        $trans->part_of_speech_id = $r->input("part_of_speech_id");
        $trans->definition = $r->input("definition");
        $trans->example = $r->input("example");
        $trans->created_by_id = Auth::user()->id;

        $dbWord->translations()->save($trans);

        DB::commit();

        return response("OK", 200);
    }

}
