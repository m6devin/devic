<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'mobile',
        'password',
        'enabled',
        'expired',
        'locked',
        'roles',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    // Rest omitted for brevity

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function omiteSecureData()
    {
        unset(
            $this->oauth_token,
            $this->roles,
            $this->invited_by_id,
            $this->app_commission,
            $this->inviter_commission,
            $this->marketer_commission,
            $this->invited_by_id,
            $this->created_at,
            $this->updated_at,
            $this->customer_group_id
        );
    }

    public function getFullname() : string
    {
        return $this->name;
    }

    public function getDefaultUsername()
    {
        if (! $this->id) {
            return null;
        }
        return $this->id * 13;
    }

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
