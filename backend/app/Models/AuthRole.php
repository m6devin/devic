<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuthRole extends Model
{
    public function defaultActions()
    {
        return $this->belongsToMany(AuthAction::class, 'auth_role_action_mappings', 'role_machine_name', 'action_machine_name');
    }
}
