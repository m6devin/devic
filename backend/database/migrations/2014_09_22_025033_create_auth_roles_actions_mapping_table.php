<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAuthRolesActionsMappingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('auth_role_action_mappings', function (Blueprint $table) {
            $table->id();
            $table->string('role_machine_name');
            $table->string('action_machine_name');
            $table->timestamps();

            $table->foreign('role_machine_name', 'fk_m2r')
            ->on('auth_roles')
            ->references('machine_name')
            ->onDelete('CASCADE')
            ->onUpdate('CASCADE');

            $table->foreign('action_machine_name', 'fk_r2m')
            ->on('auth_actions')
            ->references('machine_name')
            ->onDelete('CASCADE')
            ->onUpdate('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('auth_role_action_mappings');
    }
}
