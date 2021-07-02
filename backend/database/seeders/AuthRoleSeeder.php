<?php

namespace Database\Seeders;

use App\Models\AuthAction;
use App\Models\AuthRole;
use App\Models\AuthRoleActionMapping;
use Illuminate\Database\Seeder;

class AuthRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $items = [
            [
                'id' => 1,
                'name' => 'Admin',
                'machine_name' => 'admin',
            ],
            [
                'id' => 2,
                'name' => 'Student',
                'machine_name' => 'student',
            ],
        ];

        foreach ($items as $item) {
            AuthRole::updateOrCreate(['id' => $item['id']], $item);
        }

        $actions = [
            [
                'title' => 'Users',
                'machine_name' => AuthAction::ACTION_USER_CRUD,
                'action_type' => 'action',
                'roles' => [1]
            ],
            [
                'title' => 'My Words',
                'machine_name' => AuthAction::ACTION_MY_WORDS_CRUD,
                'action_type' => 'action',
                'roles' => [2]
            ],
        ];

        foreach ($actions as $item) {
            $roles = $item['roles'];
            unset($item['roles']);
            $action = AuthAction::updateOrCreate(['machine_name' => $item['machine_name']], $item);

            foreach ($roles as $role) {
                $a = [
                    'role_machine_name' => AuthRole::find($role)->machine_name,
                    'action_machine_name' => $action->machine_name,
                ];
                AuthRoleActionMapping::updateOrCreate($a, $a);
            }
        }
    }
}
