<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Word extends Model
{
    protected $fillable = [
        "word",
        "created_by_id",
        "language_id"
    ];

    /**
     * Get all translations of word
     *
     * @return Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function translations () {
        return $this->hasMany(Word::class, "word_id");
    }

}
