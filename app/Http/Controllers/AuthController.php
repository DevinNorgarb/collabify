<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;

class AuthController extends Controller
{
    /**
     * login api
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        if (Auth::attempt(['email' => $request->input('email'), 'password' => $request->input('id'), 'spotify_user_id' => $request->input('id')])) {
            $user = Auth::user();
            $success['token'] = $user->createToken('myApp')->accessToken;
            return response()->success('Login Successful', $success, 200);
        } else {
            return response()->error('Login failed. Invalid Username or Password.', null, 401);
        }
    }
    /**
     * Register api
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {

        $input = $request->all();
        $user = User::where("email", $input['email'])->first();

        // return response()->json($user);
        if (!$user) {
            $input['password'] = bcrypt($input['id']);
            $input['spotify_user_id'] = $input['id'];
            $user = User::create($input);
            $success['token'] = $user->createToken('myApp')->accessToken;
            $success['name'] = $user->name;
            return response()->success('Registration successfull.', $success, 200);
        } else {
            return $this->login($request);
        }
    }
}
