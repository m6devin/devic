<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Language;
use App\PartOfSpeech;
use App\Word;

class TranslateController extends Controller
{

    public function translate(Request $r) {
        $word = $r->input("q", null);

        $dbWord = Word::where("word", $word)->first();
        return view("translate.translate", [
            "dbWord" => $dbWord,
            "word" => $word,
        ]);
    }

    // find or add word
    // list translations
    // add or update translations

    public function create(Request $r) {
        $langs = Language::get();
        $partsOfSpeech = PartOfSpeech::get();

        return view("translate.save", [
            "langs" => $langs,
            "partsOfSpeech" => $partsOfSpeech,
        ]);
    }
}
