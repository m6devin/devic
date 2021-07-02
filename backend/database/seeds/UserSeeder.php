<?php

use App\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run() {
        $users = [
            [
                'username' => 'mgh', 
                'email' => 'gholami.mohammad.mgh@gmail.com', 
                'name' => 'Mohammad Gholami', 
                'password' => Hash::make('123123'), 
                'roles' => json_encode(['admin', 'student'])
            ],
        ];

        foreach ($users as $v) {
            User::updateOrCreate(['email' => $v['email']], $v);
        }
    }
}
