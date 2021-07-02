<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

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
