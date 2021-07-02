<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run() {
        $users = [
            [
                'email' => 'gholami.mohammad.mgh@gmail.com',
                'name' => 'Mohammad Gholami',
                'password' => Hash::make('123123'),
                'roles' => json_encode(['admin', 'student']),
                'enabled' => true,
            ],
        ];

        foreach ($users as $v) {
            User::updateOrCreate(['email' => $v['email']], $v);
        }
    }
}
