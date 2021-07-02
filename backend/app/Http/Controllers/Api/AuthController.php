<?php

namespace App\Http\Api\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class APIAuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     */
    public function __construct()
    {
    }

    /**
     * Get authenticated user data using api token.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAuthUser(Request $request)
    {
        return response()->json($this->guard()->user());
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        
        if (Auth::attempt($credentials)) {
            /**
             * @var User
             */
            $user = Auth::user();
            $user['permissions'] = $user->getPermissionsArray();
            return response()->json($user);
        }

        return response()->json(['message' => 'Username or password isn\'t valid!'], 401);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        try {
            $this->guard()->logout();
        } catch (\Exception $e) {
        }

        return $this->quickJsonResponse('You\'ve logged out successfully.');
    }

    /**
     * Signup new Users.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function signup(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
        ]);
        $data = $request->only('email', 'password', 'password_confirmation');

        $user = new User();
        $user->email = $data['email'];
        $user->password = Hash::make($data['password']);
        $user->save();

        $credentials = $request->only('email', 'password');
        

        return response()->json([
            'message' => 'Failed to create your account!',
        ]);
    }
}
