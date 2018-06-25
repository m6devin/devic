<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('translations', function (Blueprint $table) {
            $table->increments('id');
            $table->integer("word_id")->unsigned()->index();
            $table->integer("part_of_speech_id")->unsigned()->nullable();
            $table->integer("created_by_id")->unsigned()->nullable();
            $table->integer("language_id")->unsigned()->index();
            $table->string("translation", 512);
            $table->text("definition")->nullable();
            $table->text("example")->nullable();
            $table->timestamps();

            $table->foreign("word_id")
                ->on("words")
                ->references("id")
                ->onDelete("RESTRICT")
                ->onUpdate("CASCADE");
            $table->foreign("part_of_speech_id")
                ->on("parts_of_speech")
                ->references("id")
                ->onDelete("SET NULL")
                ->onUpdate("CASCADE");
            $table->foreign("created_by_id")
                ->on("users")
                ->references("id")
                ->onDelete("SET NULL")
                ->onUpdate("CASCADE");
            $table->foreign("language_id")
                ->on("languages")
                ->references("id")
                ->onDelete("RESTRICT")
                ->onUpdate("CASCADE");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('translations');
    }
}
