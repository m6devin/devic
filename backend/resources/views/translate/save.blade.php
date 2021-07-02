@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <form method="POST" action="{{route("translate.save")}}">
                <div class="form-group">
                    <button type="submit" class="btn btn-primary">Save</button>
                </div>
                <div class="form-group">
                    <label for="word">Word</label>
                    <input type="text" name="word" id="word" class="form-control">
                </div>
                <div class="form-group">
                    <label for="language_id">Source language</label>
                    <select name="language_id" id="language_id" class="form-control">
                        @foreach ($langs as $lang)
                        <option value="{{$lang->id}}">{{$lang->name}}</option>
                        @endforeach
                    </select>
                </div>
            </form>
        </div>
    </div>
</div>
<div id="translation_prototype" style="display:none;">
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
                <label for="language_id">Destination language</label>
                <select name="language_id" id="language_id" class="form-control">
                    @foreach ($langs as $lang)
                    <option value="{{$lang->id}}">{{$lang->name}}</option>
                    @endforeach
                </select>
            </div>
            <div class="form-group">
                <label for="translation">Translation</label>
                <input type="text" name="translation" id="translation" class="form-control" dir="rtl">
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
</div>
<script>
    

</script>
@endsection
