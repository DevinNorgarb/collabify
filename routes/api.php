<?php
// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: *');
// header('Access-Control-Allow-Headers: *');

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

Route::group(['middleware' => 'auth:api:cors'], function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/test', function () {
        return response()->success(
            'Laravel api successful.',
            ['data' => 'Test api response']
        );
    });
});

Route::match(['post', 'get', 'options'], 'login', 'AuthController@login')->middleware('cors');
Route::match(['post', 'get', 'options'], 'register', 'AuthController@register')->middleware('cors');
