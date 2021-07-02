<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStepsTable extends Migration {
    /**
     * Run the migrations.
     */
    public function up() {
        Schema::create('steps', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('days')->unsigned();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down() {
        Schema::dropIfExists('steps');
    }
}
