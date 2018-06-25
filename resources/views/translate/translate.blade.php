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
                            <label for="q">word</label>
                            <input type="text" name="q" class="form-control" value="{{request()->input("word", null)}}">
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">Search</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-sm-12 col-xs-12">
            @if ($dbWord )
                @foreach ($dbWord->myTranslations as $tr)
                    <div class="card">
                        <div class="card-body">
                            <h4 style="text-align:right; direction:rtl;">{{$tr->translation}}</h4>
                            @if ($tr->definition)
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
@endsection