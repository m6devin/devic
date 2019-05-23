<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    protected $fillable = [
        "word_id",
        "part_of_speech_name",
        "created_by_id",
        "language_id",
        "translation",
        "definition",
    ];

    /**
     * Relation to Word model
     *
     * @return Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function word()
    {
        return $this->belongsTo(Word::class, "word_id");
    }

    /**
     * Relation to PartOfSpeech model
     *
     * @return Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function partOfSpeech()
    {
        return $this->belongsTo(PartOfSpeech::class, "part_of_speech_name", 'name');
    }

    /**
     * Relation to User model
     *
     * @return Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, "created_by_id");
    }

    /**
     * Relation to Language model
     *
     * @return Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function language()
    {
        return $this->belongsTo(Language::class, 'language_alpha2code', 'alpha2code');
    }
}
