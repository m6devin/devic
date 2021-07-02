<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use DB;
use App\Word;

class MigrateDBv12DBv2 extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dbv1todbv2';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $oldWords = DB::connection('mysql_v1')
        ->table('words')
        ->where('created_by_id', 1)
        ->get();
        foreach ($oldWords as  $w) {
            if (! DB::table('words')->find($w->id)) {
                $alpha = DB::table('languages')->where('id', $w->language_id)->first();
                DB::insert('insert into words (`id`, `word`, `language_alpha2code`, `created_by_id`, `step_id`, `success_reviews_count`, `fail_reviews_count`, `total_reviews_count`, `last_review`, `archived`, `created_at`, `updated_at`) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                    $w->id,
                    $w->word,
                    $alpha->alpha2code,
                    $w->created_by_id,
                    $w->step_id,
                    $w->success_reviews_count,
                    $w->fail_reviews_count,
                    $w->total_reviews_count,
                    $w->last_review,
                    $w->archived,
                    $w->created_at,
                    $w->updated_at,
                ]);
            }

            $translations = DB::connection('mysql_v1')
            ->table('translations')
            ->where('word_id', $w->id)
            ->get();
            foreach ($translations as $t) {
                if (DB::table('translations')->find($t->id)) {
                    continue;
                }
                $alpha = DB::table('languages')->where('id', $t->language_id)->first();
                $part = DB::table('parts_of_speech')->where('id', $t->part_of_speech_id)->first();
                DB::insert('INSERT INTO `translations`(`id`, `word_id`, `part_of_speech_name`, `language_alpha2code`, `created_by_id`, `translation`, `definition`, `example`,  `created_at`, `updated_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                    $t->id,
                    $t->word_id,
                    $part ? $part->name : null,
                    $alpha->alpha2code,
                    $t->created_by_id,
                    $t->translation,
                    $t->definition,
                    $t->example,
                    $t->created_at,
                    $t->updated_at,
                ]);
            }

            $reviews = DB::connection('mysql_v1')
            ->table('reviews')
            ->where('word_id', $w->id)
            ->get();
            foreach ($reviews as $r) {
                DB::insert('INSERT INTO `reviews`(`id`, `review_type`, `item_id`, `step_id`, `remembered`, `created_at`, `updated_at`) VALUES (?,?,?,?,?,?,?)', [
                    $r->id,
                    'w',
                    $r->word_id,
                    $r->step_id,
                    $r->remembered,
                    $r->created_at,
                    $r->updated_at,
                ]);
            }
        }
    }
}
