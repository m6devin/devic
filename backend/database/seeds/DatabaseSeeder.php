<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {
    /**
     * Seed the application's database.
     */
    public function run() {
        $this->call(AuthRoleSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(LanguagesSeeder::class);
        $this->call(PartsOfSpeechSeeder::class);
        $this->call(StepsSeeder::class);
    }
}
