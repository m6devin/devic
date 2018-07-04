@extends('layouts.app') 
@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-xs-12 col-sm-12">
            <p class="">
                <a class="btn btn-primary" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                    Filters
                </a>
            </p>
            <div class="collapse" id="collapseExample">
                <div class="card">
                    <div class="card-body">
                        <form action="" method="GET">
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
                                <label for="word">Word</label>
                                <input type="text" name="word" id="word" class="form-control" value="{{request()->input('word', null)}}">
                            </div>
                            <div>
                                <button type="submit" class="btn btn-sm btn-primary">filter</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xs-12 col-sm-12">
            <div class="card">
                <div class="card-body">
                    <audio src=""></audio>
                    <table class="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <td style="width: 30px;"></td>
                                <td style="width: 20px;"></td>
                                <th>Word</th>
                                <th style="width:20px;">Lng</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($words as $w)
                            @php
                            $trc = count($w->translations)
                            @endphp
                            <tr data-id='{{$w->id}}'>
                                <td>
                                    <a href="javascript:void(0)" 
                                    onclick="copyText('{{$w->id}}')"
                                    >Copy</a>
                                </td>
                                <td class="trc-col">
                                    <i class="{{$trc == 0 ? 'text-warning' : 'text-info'}}">
                                        <small>{{$trc == 0 ? 'NA' : $trc}}</small>
                                    </i>
                                </td>
                                <td class="phrasebook-row">
                                    <input type="text" value="{{$w->word}}" id="word-{{$w->id}}" >
                                </td>
                                <td>
                                    <i>
                                        <small>
                                            ({{$w->language->alpha2code}})
                                        </small>
                                    </i>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="wordDetailsModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                
            </div>
        </div>
    </div>
</div>
@endsection