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
                <form id="trans_form" onsubmit="saveTranslation(); return false;">
                    {{csrf_field()}}
                    <input type="hidden" name="id" id="trans_form_id" value="">
                    <input type="hidden" name="word_id" id="trans_form_word_id" value="{{$dbWord->id}}">
                    <input type="hidden" name="from_language_id" id="trans_form_from_language_id" value="{{$fromLang->id}}">
                    <div class="card">
                        <div class="card-header">
                            Translation of
                            <i>"<b>{{$dbWord->word}}</b>"</i>
                            <br>
                            From : <i><b>{{$fromLang->name}}</b></i>                
                        </div>
                        <div class="card-body">
                            <div class="form-group">
                                <label for="to_language_id">To</label>
                                <select name="to_language_id" id="trans_form_to_language_id" class="form-control">
                                    @foreach ($langs as $lang)
                                    <option value="{{$lang->id}}" data-dir="{{$lang->dir}}"
                                    {{$toLang->id == $lang->id ? "selected" : ""}}>{{$lang->name}}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="part_of_speech_id">Part Of Speech</label>
                                <select name="part_of_speech_id" id="trans_form_part_of_speech_id" class="form-control">
                                @foreach ($partsOfSpeech as $p)
                                    <option value="{{$p->id}}">{{$p->name}}</option>
                                @endforeach
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="translation">Translation</label>
                                <input type="text" name="translation" id="trans_form_translation" class="form-control" dir="rtl">
                                <div class="text-danger"></div>
                            </div>
                            <div class="form-group">
                                <label for="definition">Definition</label>
                                <textarea name="definition" id="trans_form_definition" class="form-control" rows="4" dir="ltr"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="example">Example</label>
                                <textarea name="example" id="trans_form_example" class="form-control" rows="4" dir="ltr"></textarea>
                            </div>

                        </div>
                    </div>
                    <hr>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="save_translation">Save changes</button>
            </div>
        </div>
    </div>
</div>