<?php

use Illuminate\Database\Seeder;
use App\PartOfSpeech;

class PartsOfSpeechSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $parts = [
            "noun",
            "pronoun",
            "verb",
            "adjective",
            "adverb",
            "preposition",
            "conjunction",
            "interjection",
            'phrase',
        ];

        foreach ($parts as $v) {
            PartOfSpeech::updateOrCreate([
                "name" => $v
            ]);
        }
    }
}
