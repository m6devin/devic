<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Word extends Model
{
    protected $fillable = [
        'word',
        'created_by_id',
        'language_alpha2code',
    ];

    protected $casts = [
        'archived' => 'boolean',
    ];

    /**
     * Get all translations of word.
     *
     * @return Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function translations()
    {
        return $this->hasMany(Translation::class, 'word_id');
    }

    public function getTranslations($languageAlpha2Code)
    {
        if ($this->id == null) {
            return;
        }

        $this->translations = $this->translations()->with([
            'partOfSpeech',
        ])
        ->where('language_alpha2code', $languageAlpha2Code)
        ->get();
    }

    public function language()
    {
        return $this->belongsTo(Language::class, 'language_alpha2code', 'alpha2code');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'item_id')->where('review_type', 'w')->orderBy('id', 'desc');
    }

    /**
     * Get current step of Leitner review.
     */
    public function step()
    {
        return $this->belongsTo(Step::class);
    }
}
