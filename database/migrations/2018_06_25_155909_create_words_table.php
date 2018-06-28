<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('words', function (Blueprint $table) {
            $table->increments('id');
            $table->string("word", 512)->index();
            $table->integer("language_id")->unsigned();
            $table->integer("created_by_id")->unsigned()->nullable();
            $table->timestamps();

            $table->unique(["word", "language_id", "created_by_id"]);

            $table->foreign("language_id")
                ->on("languages")
                ->references("id")
                ->onDelete("RESTRICT")
                ->onUpdate("CASCADE");

            $table->foreign("created_by_id")
                ->on("users")
                ->references("id")
                ->onDelete("SET NULL")
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
        Schema::dropIfExists('words');
    }
}
