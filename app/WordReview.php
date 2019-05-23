<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WordReview extends Model
{
    public function word() 
    {
        return $this->belongsTo(Word::class);
    }
}
