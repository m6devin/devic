<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuthAction extends Model
{
    const ACTION_USER_CRUD = 'user_crud';
    const ACTION_MY_WORDS_CRUD = 'my_words_crud';
    
    public function defaultRoles()
    {
        return $this->belongsToMany(AuthRole::class, 'auth_role_action_mappings', 'action_machine_name', 'role_machine_name');
    }
}
