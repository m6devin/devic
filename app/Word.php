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

    public function language() {
        return $this->belongsTo(Language::class);
    }


}
