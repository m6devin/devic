<div class="container">
    <div class="row justify-content-center">
        <div class="col-xs-12 col-sm-12">
            <div class="card">
                <div class="card-header">Search for a word:</div>

                <div class="card-body">
                    <form method="GET" id="translate_form">
                        <div class="form-group">
                            <label for="from">Source language</label>
                            <select name="from" id="from" class="form-control">
                                @foreach ($langs as $lang)
                                <option value="{{$lang->alpha2code}}" data-dir="{{$lang->dir}}"
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
                            <input type="text" name="q" id="q_word" class="form-control" value="{{request()->input('q', null)}}">
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">Search</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="clearfix">&nbsp;</div>
        @if ($word)
        <div class="col-sm-12 col-xs-12">
            <div>
                <i>{{$word}}</i>&nbsp; @if ($dbWord )
                <a class="" href="javascript:void(0)" id="btn_edit_word_modal">Edit word</a> @else
                <a class="" href="javascript:void(0)" id="btn_add_word_modal">Add to phrasebook</a>
            </div>
            @endif

        </div>
        <div class="clearfix">&nbsp;</div>
        @endif
        <div class="col-sm-12 col-xs-12">
            @if ($dbWord)
            <button type="button" class="btn btn-primary" id="btn_add_translation">
                    Add new translation
            </button>
            <div class="clearfix">&nbsp;</div>
            @foreach ($translations as $tr)
            <div class="card">
                <div class="card-header">
                    <a href="javascript:void(0)" class="btn_edit_translation" data-serialize="{{$tr}}">Edit</a> {{$tr->word->language->alpha2code}}&nbsp;->&nbsp;{{$tr->language->alpha2code}}
                    {{$tr->partOfSpeech? "(" . $tr->partOfSpeech->name . ")" : "" }}
                </div>
                <div class="card-body">
                    <h4 style="text-align:right; direction:rtl;">{{$tr->translation}}</h4>
                    @if ($tr->definition)
                    <i>Definition:</i>
                    <p>{{$tr->definition}}</p>
                    @endif @if ($tr->example)
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