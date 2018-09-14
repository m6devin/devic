<?php

use App\Step;
use Illuminate\Database\Seeder;

class StepsSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run() {
        $steps = [
            ['id' => 1, 'name' => 'New word', 'days' => 0],
            ['id' => 2, 'name' => 'Step 1', 'days' => 1],
            ['id' => 3, 'name' => 'Step 2', 'days' => 2],
            ['id' => 4, 'name' => 'Step 3', 'days' => 4],
            ['id' => 5, 'name' => 'Step 4', 'days' => 8],
            ['id' => 6, 'name' => 'Step 5', 'days' => 16],
            ['id' => 7, 'name' => 'Archived', 'days' => 0],
        ];

        foreach ($steps as $v) {
            Step::updateOrCreate(['id' => $v['id']], [
                'name' => $v['name'],
                'days' => $v['days'],
            ]);
        }
    }
}
