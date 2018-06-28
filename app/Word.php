<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Auth;

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
        return $this->hasMany(Translation::class, "word_id");
    }

    /**
     * Get all translations of word inserted by authenticated user
     *
     * @return Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function myTranslations () {
        return $this
                ->hasMany(Translation::class, "word_id")
                ->where("created_by_id", Auth::user()->id);
    }

    /**
     * Get all translations of word inserted by authenticated user
     * @param string $alpha2code 
     * @return Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function myTranslationsToLanguage (string $alpha2code) {
        return $this
        ->hasMany(Translation::class, "word_id")
        ->where("created_by_id", Auth::user()->id);
    }

    public function language() {
        return $this->belongsTo(Language::class);
    }


}
