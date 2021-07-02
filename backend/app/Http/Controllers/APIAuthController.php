<?php

namespace App\Http\Controllers;

use App\User;
use Auth;
use Hash;
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
    public function loginWeb(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $credentials2 = ['username' => $credentials['email'], 'password' => $credentials['password']];
        if (Auth::attempt($credentials) || Auth::attempt($credentials2)) {
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
        if ($token = JWTAuth::attempt($credentials)) {
            return $this->respondWithToken($token);
        }

        return response()->json([
            'message' => 'Failed to create your account!',
        ]);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken($this->guard()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'token' => $token,
            'token_type' => 'bearer',
            // 'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }

    /**
     * Get the guard to be used during authentication.
     *
     * @return \Illuminate\Contracts\Auth\Guard
     */
    public function guard()
    {
        return Auth::guard();
    }
}
