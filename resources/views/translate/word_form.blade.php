<div class="modal fade" id="word_form_modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Add/Edit words</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="word_form">
                    {{csrf_field()}}
                    <input type="hidden" name="id" id="word_form_id" value="{{$dbWord ? $dbWord->id : ''}}">
                    <div class="form-group">
                        <label for="">Source language: </label>
                        <i>{{$fromLang? $fromLang->alpha2code : "No language selected!"}}</i>
                        <input type="hidden" name="language" id="word_form_language" value="{{$fromLang? $fromLang->alpha2code : ""}}">
                    </div>
                    <div class="form-group">
                        <label for="word">Word</label>
                        <input type="text" name="word" id="word_form_word" class="form-control" value="{{$word}}" style="direction:{{$fromLang? $fromLang->dir : "inherit"}}">
                        <div class="text-danger"></div>
                    </div>
                    <div class="form-group">
                        <button id="word_form_save" type="button" class="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
