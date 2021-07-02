<?php

namespace Database\Seeders;

use App\Models\Step;
use Illuminate\Database\Seeder;

class StepsSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run() {
        $steps = [
            ['id' => 1, 'name' => 'Step 1', 'days' => 1],
            ['id' => 2, 'name' => 'Step 2', 'days' => 2],
            ['id' => 3, 'name' => 'Step 3', 'days' => 4],
            ['id' => 4, 'name' => 'Step 4', 'days' => 8],
            ['id' => 5, 'name' => 'Step 5', 'days' => 16],
        ];

        foreach ($steps as $v) {
            Step::updateOrCreate(['id' => $v['id']], [
                'name' => $v['name'],
                'days' => $v['days'],
            ]);
        }
    }
}
