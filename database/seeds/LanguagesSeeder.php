<?php

use Illuminate\Database\Seeder;
use App\Language;

class LanguagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $langs = [
            "fa" => "Persian فارسی",
            "en" => "English"
        ];

        foreach ($langs as $k => $v) {
            Language::updateOrCreate([
                "alpha2code" => $k
            ], [
                "name" => $v
            ]);
        }
    }
}
