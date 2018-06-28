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
Auth::routes();

Route::get('/', 'TranslateController@translate')->name('translate.translate')->middleware('auth');
Route::group(["prefix" => "translation", "middleware" => "auth"], function() {
    Route::post('/word/save', 'TranslateController@saveWord')->name('translate.saveWord');
    Route::post('/translate/save', 'TranslateController@saveTranslation')->name('translate.save');
});