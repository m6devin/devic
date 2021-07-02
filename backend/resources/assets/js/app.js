/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

// window.Vue = require('vue');

// /**
//  * Next, we will create a fresh Vue application instance and attach it to
//  * the page. Then, you may begin adding components to this application
//  * or customize the JavaScript scaffolding to fit your unique needs.
//  */

// Vue.component('example-component', require('./components/ExampleComponent.vue'));

// const app = new Vue({
//     el: '#app'
// });

function getCSRFToken() {
    let token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
        return token.content;
    } else {
        return null;
    }
}

function loading(isloading) {
    if (isloading === true) {
        $("#loading").show();
    } else {
        $("#loading").hide();
    }
}

function handleXHRErrors(err, idPrefix) {
    toastr.error("An error accoured!");
    switch (err.status) {
        case 422:
            var errs = JSON.parse(err.responseText).errors
            for (var e in errs) {
                let id = "#" + (idPrefix === undefined || idPrefix === "" ? "" : idPrefix + "_") + e;
                console.log(id);

                $(id).next().html(errs[e]);
            }
            break;

        default:
            break;
    }
}

window.saveWord = function () {
    loading(true);
    $('#word_form .text-danger').html("");
    let data = $('#word_form').serialize();

    $.ajax({
        url: "/translation/word/save",
        type: "POST",
        data: data,
        success: (res) => {
            loading(false);
            toastr.success("word saved!");
            setTimeout(() => {
                $('#translate_form #q_word').val(res.word);
                $('#word_form_id').val(res.id);
                $('#translate_form').submit();
            }, 500);
        },
        error: (err) => {
            loading(false);
            handleXHRErrors(err, 'word_form');
        }
    });
}

window.saveTranslation = function () {
    loading(true);
    $('#trans_form .text-danger').html("");
    $.ajax({
        url: "/translation/translate/save",
        type: "POST",
        data: $('#trans_form').serializeArray(),
        success: (res) => {
            toastr.success("translation saved!");
            setTimeout(() => {
                // loading(false);
                window.location.reload();
            }, 500);
        },
        error: (err) => {
            loading(false);
            handleXHRErrors(err, 'trans_form');
        }
    });
}

function setSearchElemetsDirection() {
    dir = $('#from').find(':selected').data('dir');
    $('#q_word').css('direction', dir);
}

function setTranslationElementsDirection() {
    dir = $('#trans_form_to_language_id').find(':selected').data('dir');
    $('#trans_form_translation').css('direction', dir);
    $('#trans_form_definition').css('direction', dir);
    $('#trans_form_example').css('direction', dir);
}

window.copyText = function(id){
    input = document.getElementById("word-" + id);
    input.select();
    document.execCommand("copy");
    input.selectionStart = input.selectionEnd;
    toastr.info('text copied!');
};

$(document).ready(function () {
    loading(false);

    $('#btn_add_translation').click(() => {
        $('#transModal').modal('show');
        setTranslationElementsDirection();
    });
    $('.btn_edit_translation').click((e) => {
        let s = $(e.currentTarget).data('serialize');
        $('#trans_form_id').val(s.id);
        $('#trans_form_to_language_id').val(s.language_id);
        $('#trans_form_part_of_speech_id').val(s.part_of_speech_id);
        $('#trans_form_translation').val(s.translation);
        $('#trans_form_definition').val(s.definition);
        $('#trans_form_example').val(s.example);
        $('#transModal').modal('show');
        setTranslationElementsDirection();
    });
    $('#save_translation').click(saveTranslation);
    $('#save_word_btn').click(saveWord);
    $('#btn_add_word_modal, #btn_edit_word_modal').click(() => {
        $('#word_form_modal').modal('show');
    });
    $('#word_form_save').click(saveWord);

    /**
     * Set direction by source language
     * START
     */
    let dir = '';
    $('#from').change((e) => {
        setSearchElemetsDirection();
    });
    setSearchElemetsDirection();

    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    $('#trans_form_to_language_id').change((e) => {
        setTranslationElementsDirection();
    });
    setTranslationElementsDirection();

    /**
     * Set direction by source language
     * END
     */

    $('.phrasebook-row').click(e => {
        loading(true);
        let id = $(e.currentTarget).data('id');
        $.ajax({
            url: '/translation/word/' + id + '/details',
            type: 'GET',
            success: res => {
                $('#wordDetailsModal .modal-body').html('');
                let translationsMarkup = '';

                if (res.translations == null || res.translations.length == 0) {
                    translationsMarkup += '<h4 class="text-warning">No translation found!</h4>';
                    $('#wordDetailsModal .modal-body').html(translationsMarkup);
                    loading(false);
                    $('#wordDetailsModal').modal('show');    
                    return;
                }
                for(let tr of res.translations) {
                    translationsMarkup += '<div class="card">';
                    translationsMarkup += '<div class="card-header">';
                    translationsMarkup += res.language.alpha2code;
                    translationsMarkup += '&nbsp;->&nbsp;';
                    if (tr.part_of_speech_id) {
                        translationsMarkup += '(' + tr.part_of_speech.name + ')';
                    }
                    translationsMarkup += '</div>';
                    translationsMarkup += '<div class="card-body">';
                    translationsMarkup += '<h4 style="direction:'+ tr.language.dir +';">' + tr.translation+ '</h4>';
                    if (tr.definition) {
                        translationsMarkup += '<i>Definition:</i>';
                        translationsMarkup += '<p>' + tr.definition + '</p>';
                    }
                    if (tr.example) {
                        translationsMarkup += '<i>Example:</i>';
                        translationsMarkup += '<p>' + tr.example + '</p>';
                    }

                    translationsMarkup += '</div>';
                    translationsMarkup += '</div>';
                    translationsMarkup += '<br/>';
                }

                $('#wordDetailsModal .modal-body').html(translationsMarkup);
                loading(false);
                $('#wordDetailsModal').modal('show');                
            },
            error: err => {
                loading(false);
                toastr.error("An error accoured :(");
            }
        });
    });

});