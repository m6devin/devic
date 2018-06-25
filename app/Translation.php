<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    protected $fillable = [
        "word_id",
        "part_of_speech_id",
        "created_by_id",
        "language_id",
        "translation",
        "definition",
    ];
}
