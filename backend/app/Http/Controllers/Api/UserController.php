<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Check loggedin user and return user data if he is logged in.
     *
     * @param \Illuminate\Http\Request $r
     */
    public function whoami(Request $r)
    {
        /**
         * @var User
         */
        $user = Auth::user();

        if (! $user) {
            return $this->quickJsonResponse('احراز هویت ناموفق.', 401);
        }

        $user['permissions'] = $user->getPermissionsArray();
        $user->omiteSecureData();
        return response()->json($user);
    }

    /**
     *
     * @param \Illuminate\Http\Request $r
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $r)
    {

        /**
         * @var User
         */
        $user = Auth()->user();

        $this->validateProfileData($r, $user->id);

        DB::beginTransaction();

        $reqData = $this->loadProfileReqModel($r);
        $user->fill($reqData);

        $user->save();

        DB::commit();

        return response()->json(['message' => 'بروزرسانی پروفایل با موفقیت انجام شد.']);
    }

    /**
     * اعتبارسنجی اطلاعات ارسالی در اطلاعات پایه ای محصول.
     *
     * @param \Illuminate\Http\Request $r
     */
    private function validateProfileData(Request $r, $userID)
    {
        $this->validate($r, [
            'name' => ['required'],
            // 'username' => [
            //     'required', Rule::unique('users')->ignore($userID),
            // ],
            // 'email' => [
            //     'required', Rule::unique('users')->ignore($userID),
            // ],
            'mobile' => [
                'nullable',
                'regex:/^09[0-9]{9}$/i', Rule::unique('users')->ignore($userID),
            ],
        ], [
            'mobile.regex' => 'شماره موبایل وارد شده معتبر نیست.',
        ]);
    }

    private function loadProfileReqModel(Request $r)
    {
        return $r->only([
            'name',
            'email',
            'mobile',
        ]);
    }

    public function updatePassword(Request $r)
    {
        /**
         * @var User
         */
        $user = Auth()->user();

        $this->validate($r, [
            'password' => 'required|min:6|confirmed',
            'password_confirmation' => 'required',
        ], []);

        DB::beginTransaction();
        $user->password = Hash::make($r->input('password'));
        $user->save();
        DB::commit();

        return response()->json(['message' => 'بروزرسانی رمز عبور با موفقیت انجام شد.']);
    }
}
