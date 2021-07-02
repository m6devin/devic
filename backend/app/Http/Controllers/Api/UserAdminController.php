<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\User;
use App\Models\AuthRole;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserAdminController extends Controller
{
    /**
     * Load basic information required for user management
     *
     * @param \Illuminate\Http\Request $r
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBasicInfo(Request $r)
    {
        $this->authorizeAction(ACTION_USER_CRUD);

        return response()->json([
            'roles' => AuthRole::get(),
        ]);
    }

    public function index(Request $r)
    {
        $this->authorizeAction(ACTION_USER_CRUD);

        $items = User::query();
        $items = $this->buildSearchQuery($r, $items, $this->searchableProperties());
        $items = $items->orderBy('id')->paginate(10);

        return response()->json($items);
    }

    /**
     * @return array
     */
    private function searchableProperties()
    {
        return [
            'name',
            'username',
            'email',
            'mobile',
        ];
    }

    /**
     * Show details of a user.
     *
     * @param \Illuminate\Http\Request $r
     * @param int                      $id
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function details(Request $r, $id)
    {
        $this->authorizeAction(ACTION_USER_CRUD);

        $user = User::find($id);
        if (! $user) {
            return $this->quickJsonResponse('Selected user can not be found.', 404);
        }
        $user->roles = $user->getRoles();
        return response()->json($user);
    }

    /**
     * Insert or update a user
     *
     * @param \Illuminate\Http\Request $r
     * @param string|int               $id
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function save(Request $r, $id = null)
    {
        $this->authorizeAction(ACTION_USER_CRUD);

        $user = new User();

        if (null != $id && ! ($user = User::find($id))) {
            return $this->quickJsonResponse('Selected user can not be found.', 404);
        }
        $this->validateBasicData($r, $id);

        DB::beginTransaction();

        $reqData = $this->loadReqModel($r);
        $user->fill($reqData);
        $user->roles = json_encode($r->input('roles', []));
        if ($r->input('password', null)) {
            $user->password = Hash::make($r->input('password'));
        }
        $user->save();

        $base64Image = $r->input('image_base64');
        if ($base64Image) {
            $this->uploadImage($user, $base64Image);
        }

        DB::commit();

        // load decoded roles
        $user->roles = $user->getRoles();
        return response()->json($user);
    }

    /**
     * اعتبارسنجی اطلاعات ارسالی در اطلاعات پایه ای محصول.
     *
     * @param \Illuminate\Http\Request $r
     */
    private function validateBasicData(Request $r, $userID = null)
    {
        $this->validate($r, [
            'name' => ['required'],
            'username' => [
                'required',
                $userID ? Rule::unique('users')->ignore($userID) : Rule::unique('users'),
            ],
            'email' => [
                'required',
                $userID ? Rule::unique('users')->ignore($userID) : Rule::unique('users'),
            ],
            'mobile' => [
                'nullable',
                'regex:/^09[0-9]{9}$/i',
                $userID ? Rule::unique('users')->ignore($userID) : Rule::unique('users'),
            ],
        ]);
    }

    private function loadReqModel(Request $r)
    {
        return $r->only([
            'name',
            'username',
            'email',
            'mobile',
            'password',
            'enabled',
            'expired',
            'locked',
        ]);
    }

}
