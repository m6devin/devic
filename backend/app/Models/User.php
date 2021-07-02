<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'enabled',
        'roles',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


    /**
     * تعیین وضعیت مجاز یا عدم مجاز بودن کاربر برای دسترسی به یک منبع
     *
     * @param string $action
     * @return boolean
     */
    public function isPermitted(string $action): bool
    {
        $roles = $this->getRoles();
        if (empty($roles)) {
            return false;
        }
        $cnt = AuthRoleActionMapping::where('action_machine_name', $action)
        ->whereIn('role_machine_name', $roles)
        ->count();

        return $cnt > 0 ? true : false;
    }

    public function getRoles()
    {
        return json_decode($this->roles);
    }

    public function hasRole(string $role)
    {
        return in_array($role, $this->getRoles());
    }

    public function getPermissionsArray($type = null)
    {
        $arr = AuthRoleActionMapping::select('action_machine_name')
        ->whereIn('role_machine_name', $this->getRoles());
        if ($type === 'action' || $type === 'menu') {
            $arr = $arr->join('auth_actions', 'machine_name', '=', 'action_machine_name')
            ->where('auth_actions.action_type', $type);
        }
        $arr = $arr->get()
        ->toArray();

        $perms = [];
        foreach ($arr as $item) {
            $perms[$item['action_machine_name']] = true;
        }
        return $perms;
    }
}
