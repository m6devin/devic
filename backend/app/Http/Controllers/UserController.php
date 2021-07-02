<?php

namespace App\Http\Controllers;

use Auth;
use Illuminate\Http\Request;
use App\Country;
use App\User;
use Illuminate\Validation\Rule;
use DB;
use Storage;
use Hash;

class UserController extends Controller
{
    /**
     * Check loggedin user and return user data if he is logged in.
     *
     * @param \Illuminate\Http\Request $r
     */
    public function whoami(Request $r)
    {
        $user = Auth::user();

        if (! $user) {
            return $this->quickJsonResponse('احراز هویت ناموفق.', 401);
        }

        $user['permissions'] = $user->getPermissionsArray();
        $user->omiteSecureData();
        return response()->json($user);
    }

    /**
     * لیست اطلاعات پایه برای ویرایش  پروفایل
     *
     * @param \Illuminate\Http\Request $r
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function profileBasicInfo(Request $r)
    {
        return response()->json([
            'countries' => Country::get(),
        ]);
    }


    /**
     *
     * @param \Illuminate\Http\Request $r
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $r)
    {
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
            // 'username',
            'email',
            'mobile',
        ]);
    }

    public function updatePassword(Request $r)
    {
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

    public function updateAvatar(Request $r)
    {
        $user = Auth()->user();

        $this->validate($r, [
            'image_base64' => 'required'
        ]);

        DB::beginTransaction();

        $base64Image = $r->input('image_base64');
        $newPath = $this->uploadImage($user, $base64Image);

        DB::commit();

        return response()->json(['avatar' => $newPath]);
    }

    /**
     * آپلود و ذخیره فایل تصویر ارسال شده را برعهده دارد.
     *
     * @return string آدرس نام فایل ذخیره شده
     */
    private function uploadImage(User $user, string $base64Data)
    {
        $data = explode(',', $base64Data);
        if (2 != count($data)) {
            return null;
        }
        $image = base64_decode($data[1]);
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete([$user->avatar]);
        }
        $unq = str_replace('.', '_', uniqid(null, true));
        $filename = sprintf('user/%s_%s.png', $user->id, $unq);
        Storage::disk('public')->put($filename, $image);

        $user->avatar = $filename;
        $user->save();

        return $user->avatar;
    }
}
