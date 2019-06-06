<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', 'HomeController@index');
Route::get('securearea', function () {
    return view('securearea');
});

Auth::routes();
Route::post('api/login_web', 'APIAuthController@loginWeb');
Route::get('api/logout', 'APIAuthController@logout');
Route::get('api/whoami', 'UserController@whoami');

Route::group([
    'prefix' => 'api/admin',
    'middleware' => 'auth.admin',
], function () {
    Route::get('user/index', 'UserAdminController@index');
    Route::get('user/basic_info', 'UserAdminController@getBasicInfo');
    Route::post('user/save/{id?}', 'UserAdminController@save');
    Route::get('user/{id}/details', 'UserAdminController@details');
});

Route::group(['prefix' => '/api/v2/userarea', 'middleware' => ['auth'] ], function () {
    // User profile
    Route::post('/profile/update', 'UserController@updateProfile');
    Route::post('/profile/update_password', 'UserController@updatePassword');
    Route::post('/profile/update_avatar', 'UserController@updateAvatar');
    Route::get('/profile/basic_info', 'UserController@profileBasicInfo');

    // Words' APIs
    Route::get('word/index', 'WordController@index');
    Route::get('word/basic_info', 'WordController@getBasicInfo');
    Route::post('word/save/{id?}', 'WordController@save');
    
    // Translate page's APIs
    Route::get('translate/basic_info', 'TranslateController@getBasicInfo');
    Route::post('translate/search', 'TranslateController@searchForTranslation');
    Route::post('translate/save/{id?}', 'TranslateController@save');
    Route::get('translate/{id}/delete', 'TranslateController@deleteTranslation');
});
