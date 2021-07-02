<?php

namespace App\Models;

class WordRepository
{
    private $word;

    public function findWord(string $word, $languageAlpha2Code, $ownerID = null)
    {
        $qry = Word::query()
        ->where('word', $word)
        ->where('language_alpha2code', $languageAlpha2Code);
        if ($ownerID) {
            $qry = $qry->where('created_by_id', $ownerID);
        }

        $this->word = $qry->first();

        return $this->word;
    }
}
