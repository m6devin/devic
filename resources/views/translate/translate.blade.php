@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row justify-content-center">
        <div class="col-xs-12 col-sm-12">
            <div class="card">
                <div class="card-header">Search for a word:</div>

                <div class="card-body">
                    <form method="GET">
                        <div class="form-group">
                            <label for="from">Source language</label>
                            <select name="from" id="from" class="form-control">
                                @foreach ($langs as $lang)
                                <option value="{{$lang->alpha2code}}"
                                {{request()->input("from", null) == $lang->alpha2code ? "selected" : ""}}>{{$lang->name}}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="to">Destination language</label>
                            <select name="to" id="to" class="form-control">
                                @foreach ($langs as $lang)
                                <option value="{{$lang->alpha2code}}"
                                {{request()->input("to", null) == $lang->alpha2code ? "selected" : ""}}>{{$lang->name}}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="q">word</label>
                            <input type="text" name="q" id="q_word" class="form-control" value="{{request()->input("q", null)}}">
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">Search</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="clearfix">&nbsp;</div>
        <div class="col-sm-12 col-xs-12">
                @if (request()->input("q", null) && request()->input("from", null) && request()->input("to", null))
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#transModal">
                        Add new translation
                </button>
                <div class="clearfix">&nbsp;</div>
                @endif
            @if ($dbWord )
                @foreach ($dbWord->myTranslations as $tr)
                    <div class="card">
                        <div class="card-header">
                            {{$tr->word->language->alpha2code}}&nbsp;->&nbsp;{{$tr->language->alpha2code}}
                            {{$tr->partOfSpeech? "(" . $tr->partOfSpeech->name . ")" : "" }}
                        </div>
                        <div class="card-body">
                            <h4 style="text-align:right; direction:rtl;">{{$tr->translation}}</h4>
                            @if ($tr->definition)
                            <i>Definition:</i>
                            <p>{{$tr->definition}}</p>
                            @endif
                            @if ($tr->example)
                            <i>Exmaple:</i>
                            <blockquote>
                                {{$tr->example}}
                            </blockquote>
                            @endif
                        </div>
                    </div>
                @endforeach
            @endif
        </div>
    </div>
</div>

<div class="modal fade" id="transModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Translation</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form action="{{route("translate.save")}}" id="trans_form">
                    {{csrf_field()}}
                    <input type="hidden" name="word" id="word">
                    <input type="hidden" name="from_language_id" id="from_language_id">
                    <input type="hidden" name="to_language_id" id="to_language_id">
                    <div class="card">
                        <div class="card-body">
                            <div class="form-group">
                                <label for="part_of_speech_id">Part Of Speech</label>
                                <select name="part_of_speech_id" id="part_of_speech_id" class="form-control">
                                @foreach ($partsOfSpeech as $p)
                                    <option value="{{$p->id}}">{{$p->name}}</option>
                                @endforeach
                                </select>
                            </div>                            
                            <div class="form-group">
                                <label for="translation">Translation</label>
                                <input type="text" name="translation" id="translation" class="form-control" dir="rtl">
                                <div class="text-danger"></div>
                            </div>
                            <div class="form-group">
                                <label for="definition">Definition</label>
                                <textarea name="definition" id="definition" class="form-control" rows="4" dir="ltr"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="example">Example</label>
                                <textarea name="example" id="example" class="form-control" rows="4" dir="ltr"></textarea>
                            </div>
                            
                        </div>
                    </div>
                    <hr>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="save-translation">Save changes</button>
            </div>
        </div>
    </div>
</div>
@endsection