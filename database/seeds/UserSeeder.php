<?php

use App\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run() {
        $users = [
            ['email' => 'mgh', 'password' => Hash::make('123123')],
        ];

        foreach ($users as $v) {
            User::updateOrCreate(['email' => $v['email']], [
                'password' => $v['password'],
            ]);
        }
    }
}
