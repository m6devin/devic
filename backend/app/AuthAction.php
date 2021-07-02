<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AuthAction extends Model
{
    public function defaultRoles()
    {
        return $this->belongsToMany(AuthRole::class, 'auth_role_action_mappings', 'action_machine_name', 'role_machine_name');
    }
}
