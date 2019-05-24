<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->nullable();
            $table->string('username', 100)->unique()->nullable();
            $table->string('email', 100)->unique();
            $table->string('mobile', 15)->unique()->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('roles')->nullable();
            $table->boolean('enabled')->default(true);
            $table->boolean('expired')->default(false);
            $table->boolean('locked')->default(false);
            $table->rememberToken();

            $table->string('oauth_token')->nullable();
            $table->string('avatar')->nullable();

            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
