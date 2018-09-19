<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWordsTable extends Migration {
    /**
     * Run the migrations.
     */
    public function up() {
        Schema::create('words', function (Blueprint $table) {
            $table->increments('id');
            $table->string('word', 512)->index();
            $table->integer('language_id')->unsigned();
            $table->integer('step_id')->unsigned()->nullable();
            $table->integer('created_by_id')->unsigned()->nullable();
            $table->integer('success_reviews_count')->default(0);
            $table->integer('fail_reviews_count')->default(0);
            $table->integer('total_reviews_count')->default(0);
            $table->datetime('last_review')->nullable();
            $table->boolean('archived')->default(false);
            $table->timestamps();

            $table->unique(['word', 'language_id', 'created_by_id']);

            $table->foreign('language_id')
                ->on('languages')
                ->references('id')
                ->onDelete('RESTRICT')
                ->onUpdate('CASCADE');

            $table->foreign('step_id')
                ->on('steps')
                ->references('id')
                ->onDelete('RESTRICT')
                ->onUpdate('CASCADE');

            $table->foreign('created_by_id')
                ->on('users')
                ->references('id')
                ->onDelete('SET NULL')
                ->onUpdate('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down() {
        Schema::dropIfExists('words');
    }
}
