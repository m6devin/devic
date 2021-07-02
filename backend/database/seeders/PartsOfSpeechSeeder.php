<?php

namespace Database\Seeders;

use App\Models\PartOfSpeech;
use Illuminate\Database\Seeder;

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
