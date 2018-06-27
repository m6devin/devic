
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

function loading(isloading) {
    if (isloading === true) {
        $("#loading").show();
    } else {
        $("#loading").hide();
    }
}

function saveChanges () {
    loading(true);
    $("#word").val($("#q_word").val());
    $("#from_language_id").val($("#from").val());
    $("#to_language_id").val($("#to").val());
    $('#trans_form .text-danger').html("");
    $.ajax({
        url: "/translation/translate/save",
        type: "POST",
        data: $('#trans_form').serializeArray(),
        success: (res) => {
            loading(false);
            toastr.success("translation saved!");
            setTimeout(() => {
                window.location.reload();
            }, 500);
        },
        error: (err) => {
            loading(false);
            toastr.error("An error accoured!");
            switch (err.status) {
                case 422:
                    var errs = JSON.parse(err.responseText).errors
                    for (var e in errs) {
                        $("#" + e).next().html(errs[e]);
                    }
                    break;
            
                default:
                    break;
            }
        }
    });
}

$(document).ready(function () {
    loading(false);
    $('#save-translation').click(saveChanges);
});