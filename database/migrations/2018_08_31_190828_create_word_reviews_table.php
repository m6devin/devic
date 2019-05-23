<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWordReviewsTable extends Migration {
    /**
     * Run the migrations.
     */
    public function up() {
        Schema::create('word_reviews', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('word_id')->unsigned()->index();
            $table->integer('step_id')->unsigned()->nullable();
            $table->boolean('remembered');
            $table->timestamps();

            $table->foreign('word_id')
            ->on('words')
            ->references('id')
            ->onDelete('CASCADE')
            ->onUpdate('CASCADE');

            $table->foreign('step_id')
            ->on('steps')
            ->references('id')
            ->onDelete('CASCADE')
            ->onUpdate('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down() {
        Schema::dropIfExists('reviews');
    }
}
