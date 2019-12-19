<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('/upload1', 'UploadController@upload');
Route::resource('upload', 'UploadController');

Route::group(['middleware' => 'auth:api'], function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/test', function () {
        return response()->json([
            'data' => 'Test api response',
            'msg' => 'Laravel api successful.',
            'success' => 1,
        ]);
    });

});

Route::post('login', 'AuthController@login');
Route::post('register', 'AuthController@register');
