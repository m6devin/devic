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
Route::post('/login', 'APIAuthController@login');
Route::post('/signup', 'APIAuthController@signup');

Route::get('/get_user', 'APIAuthController@getAuthUser');
Route::get('/translation/basic_info', 'TranslateController@basicInfo');
Route::group([
    'prefix' => 'translation',
    'middleware' => 'jwt_auth', 
], function () {
    Route::get('/translate', 'TranslateController@translateAPI');
    Route::post('/save_word', 'TranslateController@saveWord');
    Route::post('/save_translation', 'TranslateController@saveTranslation');
    Route::get('/phrasebook', 'TranslateController@phrasebookAPI');
    Route::post('/word/{word}/set_review', 'TranslateController@setWordReview');

});