<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReviewsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->string('review_type', 2)->comment('w: review words to remember translations; t: review translations to remember words');
            $table->bigInteger('item_id')->unsigned();
            $table->bigInteger('step_id')->unsigned()->nullable();
            $table->boolean('remembered');
            $table->timestamps();

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
    public function down()
    {
        Schema::dropIfExists('reviews');
    }
}
