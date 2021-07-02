@extends('layouts.app')

@section('content')

@include("translate.translate_search")

@include("translate.word_form")

@if ($dbWord && $fromLang && $toLang )
@include("translate.word_translation_save_form")
@endif

@endsection