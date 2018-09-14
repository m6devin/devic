<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Word extends Model {
    protected $fillable = [
        'word',
        'created_by_id',
        'language_id',
    ];

    /**
     * Get all translations of word.
     *
     * @return Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function translations() {
        return $this->hasMany(Translation::class, 'word_id');
    }

    public function language() {
        return $this->belongsTo(Language::class);
    }

    public function reviews() {
        return $this->hasMany(Review::class)->orderBy('id', 'desc');
    }

    /**
     * Get current step of Leitner review.
     */
    public function step() {
        return $this->belongsTo(Step::calss);
    }
}
